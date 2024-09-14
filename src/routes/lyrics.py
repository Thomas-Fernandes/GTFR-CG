from flask import Blueprint, request, Response
from flask_cors import cross_origin
from lyricsgenius import Genius

from ast import literal_eval
from re import sub, split
from requests.exceptions import ReadTimeout as ReadTimeoutException
from typing import Optional

import src.constants as const
from src.logger import log
from src.statistics import updateStats
from src.web_utils import createApiResponse

from src.app import app
bp_lyrics = Blueprint(const.ROUTES.lyrics.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.lyrics.path

genius = None
try:
    genius = Genius(access_token=const.GENIUS_API_TOKEN, retries=3)
    session[const.SessionFields.genius_token.value] = const.GENIUS_API_TOKEN
except TypeError as e:
    log.error(f"Error while creating Genius object: {e}. "
              "Lyrics fetching will not work.")

def fetchLyricsFromGenius(song_title: str, artist_name: str) -> list[dict[str, str]]:
    """ Tries to fetch the lyrics of a song from Genius.com.
    :param song_title: [string] The title of the song.
    :param artist_name: [string] The name of the artist.
    :return: [list] A list of tuples with section names and lyrics.
    """
    if genius is None:
        return [{"section": "error", "lyrics": const.ERR_GENIUS_TOKEN}]

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
    lyrics = sub(r"\d+Embed$", '', lyrics).strip()

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
    lyrics_parts = [{
        "section": "[Metadata]",
        "lyrics": f"id: {song.id}\nurl: {song.url}"
    }]
    # other available metadata: '_body', '_client', 'artist', 'lyrics', 'primary_artist', 'stats', 'annotation_count',
    #   'api_path', 'full_title', 'header_image_thumbnail_url', 'header_image_url', 'lyrics_owner_id', 'lyrics_state',
    #   'path', 'pyongs_count', 'song_art_image_thumbnail_url', 'song_art_image_url', 'title', 'title_with_featured'
    lyrics_parts += [{"section": parts[i], "lyrics": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]

    log.debug("Lyrics split into parts successfully.")
    updateStats(to_increment=const.AvailableStats.lyricsFetches.value)

    log.info(f"Lyrics fetch for {artist_name} - \"{song_title}\" complete.")
    return lyrics_parts

@bp_lyrics.route(api_prefix + "/get-genius-lyrics", methods=["POST"])
@cross_origin()
def getGeniusLyrics() -> Response:
    """ Fetches the lyrics of a song from Genius.com.
    :return: [Response] The response to the request.
    """
    log.debug("POST - Fetching lyrics from Genius...")
    body = literal_eval(request.get_data(as_text=True))
    song_name: Optional[str] = body.get("songName")
    artist: Optional[str] = body.get("artist")
    if song_name is None or artist is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG_URL)

    lyrics_parts = fetchLyricsFromGenius(song_name, artist)
    return createApiResponse(const.HttpStatus.OK.value, "Lyrics fetched successfully.", {"lyrics_parts": lyrics_parts})
