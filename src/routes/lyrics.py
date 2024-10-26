from flask import Blueprint, request, Response
from flask_restx import Resource
from lyricsgenius import Genius

from ast import literal_eval
from json import dumps
from re import sub, split
from requests.exceptions import ReadTimeout as ReadTimeoutException
from time import time
from typing import Literal, Optional, Union

import src.constants as const
from src.decorators import retry
from src.docs import models, ns_lyrics
from src.logger import log
from src.logger import log, LogSeverity
from src.statistics import updateStats
from src.utils.web_utils import createApiResponse

from src.app import api, app
bp_lyrics = Blueprint(const.ROUTES.lyrics.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.lyrics.path
api.add_namespace(ns_lyrics, path=api_prefix)

genius = None
try:
    genius = Genius(access_token=const.GENIUS_API_TOKEN, retries=3)
    session[const.SessionFields.genius_token.value] = const.GENIUS_API_TOKEN
except TypeError as e:
    log.error(f"Error while creating Genius object: {e}. "
              "Lyrics fetching will not work.")

def getSongContributors(song_id: Union[int, Literal["manual"]] = -1) -> list[str]:
    """ Adds the contributors to the song data.
    :param song_id: [int | str] The ID of the song or "manual".
    """
    if song_id == "manual":
        return []
    if song_id == -1:
        raise ValueError("Song ID not found in metadata.")
    if genius is None:
        raise ValueError("Genius API connection not established.")

    song_contributors = None
    try:
        with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
            song_contributors = genius.song_contributors(song_id)
    except ReadTimeoutException as e:
        log.error(f"Lyrics fetch failed: {e}")
    if song_contributors is None:
        raise ValueError("Song contributors not found.")

    contributors = []
    for scribe in song_contributors["contributors"]["transcribers"]:
        if scribe["attribution"] * 100 > const.ATTRIBUTION_PERCENTAGE_TOLERANCE: # ignore contributors with less
            contributors.append({
                "login": scribe["user"]["login"],
                "attribution": str(int(scribe["attribution"] * 100)) + "%", # may be useful later
            })
        else:
            log.debug(f"  Ignoring {scribe['user']['login']} with {round(scribe['attribution'] * 100, 2)}% attribution.")
    return [c["login"] for c in contributors[:3]]

def areLyricsNotFound(lyrics: list[dict[str, str]]) -> bool:
    """ Checks if the lyrics are not found.
    :param lyrics: [list] The lyrics to check.
    :return: [bool] True if the lyrics are not found, False otherwise.
    """
    return len(lyrics) == 1 \
        and lyrics[0]["section"] == "warn" \
        and lyrics[0]["lyrics"] == const.ERR_LYRICS_NOT_FOUND

@retry(condition=(lambda x: not areLyricsNotFound(x)), times=3)
def fetchLyricsFromGenius(song_title: str, artist_name: str) -> list[dict[str, str]]:
    """ Tries to fetch the lyrics of a song from Genius dot com.
    :param song_title: [string] The title of the song.
    :param artist_name: [string] The name of the artist.
    :return: [list] A list of tuples with section names and lyrics.
    """
    log.debug(f"Fetching lyrics for {artist_name} - \"{song_title}\"...")
    start = time()
    if genius is None:
        return [{"section": "error", "lyrics": const.ERR_GENIUS_TOKEN_NOT_FOUND}]

    song: Optional[Genius.Song] = None
    try:
        with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
            song = genius.search_song(song_title, artist_name)
    except ReadTimeoutException as e:
        log.error(f"Lyrics fetch failed: {e}")
    if song is None:
        return [{"section": "warn", "lyrics": const.ERR_LYRICS_NOT_FOUND}]

    log.debug("Sanitizing the fetched lyrics...")
    lyrics = song.lyrics
    # Removing charabia at the beginning and end of the lyrics
    lyrics = sub(r"^.*Lyrics\[", '[', lyrics).strip()
    lyrics = sub(r"Embed\s*\d*\s*$", '', lyrics).strip()
    lyrics = sub(r"\d+\s*$", '', lyrics).strip()

    # Removing "You might also like" advertising's legend
    lyrics = lyrics.replace("You might also like", '\n')

    # Removing track name translation header
    if lyrics.startswith("[Paroles de") or lyrics.startswith("[Traduction de"):
        lyrics = '\n'.join(lyrics.split('\n')[1:]).strip()

    # Ensure double newline before song parts
    def add_newline_before_song_parts(lyrics: str) -> str:
        """ Adds a newline before song parts that are enclosed in double quotes.
        :param lyrics: [string] The stringified lyrics to process.
        :return: [string] The processed stringified lyrics.
        """
        return sub(r"(?<=\])\s*(?=\[)", "\n\n", lyrics)

    lyrics = add_newline_before_song_parts(lyrics)
    log.debug("Lyrics sanitized successfully.")

    # Split lyrics into blocks based on sections, e.g. "[Chorus]"
    parts = split(r"(\[.*?\])", lyrics)
    json_contributors = dumps(getSongContributors(song.id))
    lyrics_parts = [{ # the first part is metadata
        "section": "[Metadata]",
        "lyrics": f"id: {song.id}" + "\n"
            f"artist: {song.artist}" + "\n"
            f"title: {song.title}" + "\n"
            f"contributors: {json_contributors}"
    }]
    # other available metadata: '_body', '_client', 'url', 'primary_artist', 'stats', 'api_path', 'path',
    #   'full_title', 'header_image_thumbnail_url', 'header_image_url', 'lyrics_owner_id', 'lyrics_state',
    #   'song_art_image_thumbnail_url', 'song_art_image_url', 'title_with_featured'
    lyrics_parts += [{"section": parts[i], "lyrics": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]

    log.debug("Lyrics split into parts successfully.")
    updateStats(to_increment=const.AvailableStats.lyricsFetches.value)

    log.log(f"Lyrics fetch for {artist_name} - \"{song_title}\" complete.").time(LogSeverity.LOG, time() - start)
    return lyrics_parts

@ns_lyrics.route("/get-genius-lyrics")
class GeniusLyricsResource(Resource):
    @ns_lyrics.doc("post_get_genius_lyrics")
    @ns_lyrics.expect(models[const.ROUTES.lyrics.bp_name]["get-genius-lyrics"]["payload"])
    @ns_lyrics.response(const.HttpStatus.OK.value, const.MSG_LYRICS_FETCH_SUCCESS, models[const.ROUTES.lyrics.bp_name]["get-genius-lyrics"]["response"])
    @ns_lyrics.response(const.HttpStatus.BAD_REQUEST.value, const.ERR_LYRICS_MISSING_PARAMS)
    def post(self) -> Response:
        """ Fetches the lyrics of a song from Genius dot com """
        log.log("POST - Fetching lyrics from Genius...")

        body = literal_eval(request.get_data(as_text=True))
        song_name: Optional[str] = body.get("songName")
        artist: Optional[str] = body.get("artist")

        if song_name is None or artist is None:
            log.error(const.ERR_LYRICS_MISSING_PARAMS)
            return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_LYRICS_MISSING_PARAMS)

        lyrics_parts = fetchLyricsFromGenius(song_name, artist)
        return createApiResponse(const.HttpStatus.OK.value, const.MSG_LYRICS_FETCH_SUCCESS, {"lyricsParts": lyrics_parts})
