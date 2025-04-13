from lyricsgenius.genius import Genius, Song as GeniusSongType
from requests.exceptions import ReadTimeout as ReadTimeoutException

from json import dumps
from re import split, sub
from time import time
from typing import Literal, Optional, Union

from src.constants.dotenv import GENIUS_API_TOKEN, GENIUS_API_TOKEN_PATTERN
from src.constants.enums import AvailableStats, SessionFields
from src.constants.image_generation import ATTRIBUTION_PERCENTAGE_TOLERANCE
from src.constants.responses import Error

from src.app import session
from src.decorators import retry
from src.statistics import updateStats
from src.l10n import locale
from src.logger import SeverityLevel, log

genius = None
try:

    def validateGeniusTokenIntegrity() -> Optional[str]:
        """Checks the integrity of the Genius API token
        :return: [str] The error message if the token is invalid, None otherwise
        """
        if GENIUS_API_TOKEN is None or GENIUS_API_TOKEN == "":
            return "Genius API token not found."
        if len(GENIUS_API_TOKEN) != 64 or GENIUS_API_TOKEN_PATTERN.match(GENIUS_API_TOKEN) is None:
            return "Invalid Genius API token."
        return None

    err = validateGeniusTokenIntegrity()
    if err:
        raise ValueError(err)

    genius = Genius(access_token=GENIUS_API_TOKEN, retries=3)
    session[SessionFields.GENIUS_TOKEN] = GENIUS_API_TOKEN
except TypeError as e:
    log.error(f"Error while creating Genius object: {e}. Lyrics fetching will not work.")


def getSongContributors(song_id: Union[int, Literal["manual"]] = -1) -> list[str]:
    """Adds the contributors to the song data
    :param song_id: [int | str] The ID of the song or "manual"
    """
    if song_id == "manual":
        return []
    if song_id == -1:
        raise ValueError("Song ID not found in metadata.")
    if genius is None:
        raise ValueError("Genius API connection not established.")

    song_contributors = None
    try:
        with log.redirect_stdout_stderr() as (stdout, stderr):  # type: ignore
            song_contributors = genius.song_contributors(song_id)
    except ReadTimeoutException as e:
        log.error(f"Lyrics fetch failed: {e}")
    if song_contributors is None:
        raise ValueError("Song contributors not found.")

    contributors = []
    for scribe in song_contributors["contributors"]["transcribers"]:
        if scribe["attribution"] * 100 > ATTRIBUTION_PERCENTAGE_TOLERANCE:  # ignore contributors with less
            contributors.append(
                {
                    "login": scribe["user"]["login"],
                    "attribution": str(int(scribe["attribution"] * 100)) + "%",  # may be useful later
                }
            )
        else:
            log.debug(
                f"  Ignoring {scribe['user']['login']} with {round(scribe['attribution'] * 100, 2)}% attribution."
            )
    return [c["login"] for c in contributors[:3]]


def getGeniusSong(song_title: str, artist_name: str) -> GeniusSongType:  # type: ignore
    if genius is None:
        return None

    result: Optional[GeniusSongType] = None
    try:
        with log.redirect_stdout_stderr() as (stdout, stderr):  # type: ignore
            result = genius.search_song(song_title, artist_name)
    except ReadTimeoutException as e:
        log.error(f"Lyrics fetch failed: {e}")
    return result


def areLyricsNotFound(lyrics: list[dict[str, str]]) -> bool:
    """Checks if the lyrics are not found
    :param lyrics: [list] The lyrics to check
    :return: [bool] True if the lyrics are not found, False otherwise
    """
    return (
        len(lyrics) == 1
        and lyrics[0]["section"] == "warn"
        and lyrics[0]["lyrics"] == locale.get(Error.LYRICS_NOT_FOUND)
    )

@retry(condition=(lambda x: not areLyricsNotFound(x)), times=3)
def fetchLyricsFromGenius(song_title: str, artist_name: str) -> list[dict[str, str]]:
    """Tries to fetch the lyrics of a song from Genius dot com
    :param song_title: [string] The title of the song
    :param artist_name: [string] The name of the artist
    :return: [list] A list of tuples with section names and lyrics
    """
    log.debug(f"Fetching lyrics for {artist_name} - \"{song_title}\"...")
    start = time()
    if genius is None:
        return [{"section": "error", "lyrics": locale.get(Error.GENIUS_TOKEN_NOT_FOUND)}]

    song: Optional[GeniusSongType] = getGeniusSong(song_title, artist_name)
    if song is None:
        return [{"section": "warn", "lyrics": locale.get(Error.LYRICS_NOT_FOUND)}]

    log.debug("Sanitizing the fetched lyrics...")

    def sanitizeLyrics(lyrics: str) -> str:
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
            """Adds a newline before song parts that are enclosed in double quotes
            :param lyrics: [string] The stringified lyrics to process
            :return: [string] The processed stringified lyrics
            """
            return sub(r"(?<=\])\s*(?=\[)", "\n\n", lyrics)

        return add_newline_before_song_parts(lyrics)

    lyrics = sanitizeLyrics(song.lyrics)
    log.debug("Lyrics sanitized successfully.")

    def generateLyricsParts(lyrics: str) -> list[dict[str, str]]:
        # Split lyrics into blocks based on sections, e.g. "[Chorus]"
        parts = split(r"(\[.*?\])", lyrics)
        jsonified_contributors = dumps(getSongContributors(song.id))
        lyrics_parts = [
            {  # the first part is metadata
                "section": "[Metadata]",
                "lyrics": f"id: {song.id}" + "\n"
                f"artist: {song.artist}" + "\n"
                f"title: {song.title}" + "\n"
                f"contributors: {jsonified_contributors}",
            }
        ]
        # other available metadata: '_body', '_client', 'url', 'primary_artist', 'stats', 'api_path', 'path',
        #   'full_title', 'header_image_thumbnail_url', 'header_image_url', 'lyrics_owner_id', 'lyrics_state',
        #   'song_art_image_thumbnail_url', 'song_art_image_url', 'title_with_featured'
        lyrics_parts += [{"section": parts[i], "lyrics": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
        return lyrics_parts

    lyrics_parts = generateLyricsParts(lyrics)

    log.debug("Lyrics split into parts successfully.")
    updateStats(to_increment=AvailableStats.LYRICS_FETCHES)

    log.info(
        f"Lyrics fetch for {artist_name} - \"{song_title}\" complete."
    ).time(SeverityLevel.INFO, time() - start)
    return lyrics_parts
