from requests.exceptions import ReadTimeout as ReadTimeoutException
from flask import Blueprint, render_template, request
from lyricsgenius import Genius

from re import sub, split, match
from typing import Optional

import src.constants as const
from src.logger import log
from src.routes.redirect import renderRedirection
from src.statistics import updateStats
from src.typing import Context, RenderView

from src.app import app
bp_lyrics = Blueprint(const.ROUTES.lyrics.bp_name, __name__.split('.')[-1])
session = app.config

genius = None
try:
    genius = Genius(const.GENIUS_API_TOKEN)
    session[const.SessionFields.genius_token.value] = const.GENIUS_API_TOKEN
except TypeError as e:
    log.error(f"Error while creating Genius object: {e}. "
              "Lyrics fetching will not work.")

@staticmethod
def fetchLyricsFromGenius(song_title: str, artist_name: str) -> list[tuple[str, str]]:
    """ Fetches lyrics from Genius.com and splits them into parts.
    :param song_title: [string] The title of the song.
    :param artist_name: [string] The name of the artist.
    :return: [list] A list of tuples with section names and lyrics.
    """
    if genius is None:
        return [("Error", "Genius API token not found.")]

    song: Optional[Genius.Song] = None
    try:
        with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
            song = genius.search_song(song_title, artist_name)
    except ReadTimeoutException as e:
        log.error(f"Lyrics fetch failed: {e}")
    if song is None:
        return [{"section": "Error", "lyrics": const.ERR_GENIUS_TOKEN}]

    log.debug("Sanitizing the fetched lyrics...")
    lyrics = song.lyrics
    # Removing charabia at the beginning and end of the lyrics
    lyrics = sub(r"^.*Lyrics\[", '[', lyrics).strip()
    lyrics = sub(r"\d+Embed$", '', lyrics).strip()

    # Removing "You might also like" part
    lyrics = sub(r"You might also like", '\n', lyrics)

    if lyrics.startswith("[Paroles de") or lyrics.startswith("[Traduction de"):
        lyrics = '\n'.join(lyrics.split('\n')[1:]).strip()

    # Ensure double newline before song parts
    @staticmethod
    def add_newline_before_song_parts(lyrics: str) -> str:
        """ Adds a newline before song parts that are enclosed in double quotes.
        :param lyrics: [string] The stringified lyrics to process.
        :return: [string] The processed stringified lyrics.
        """
        return sub(r"(?<=\])\s*(?=\[)", "\n\n", lyrics)

    lyrics = add_newline_before_song_parts(lyrics)
    log.debug("Lyrics sanitized successfully.")

    # Split lyrics into blocks based on sections like [Chorus], [Verse], etc.
    parts = split(r'(\[.*?\])', lyrics)
    lyrics_parts = [(parts[i], parts[i + 1].strip()) for i in range(1, len(parts) - 1, 2)]

    log.debug("Lyrics split into parts successfully.")
    updateStats(to_increment=const.AvailableStats.lyricsFetches.value)

    log.info(f"Lyrics fetch for {artist_name} - \"{song_title}\" complete.")
    return lyrics_parts

@bp_lyrics.route(const.ROUTES.lyrics.path, methods=["POST"])
def updateTextarea() -> RenderView:
    """ Updates the lyrics context variable with the fetched or edited lyrics based on action.
    :return: [RenderView] The rendered view, with the updated lyrics.
    """
    artist: Optional[str] = request.form.get("artist", None)
    song: Optional[str]   = request.form.get("song", None)
    action: str           = request.form.get("action", "search")
    lyrics_parts          = []

    if action == "search" and artist is not None and song is not None:
        lyrics_parts = fetchLyricsFromGenius(song, artist)
        lyrics_parts = [{"section": section, "lyrics": part} for section, part in lyrics_parts]
    elif action == "save":
        i = 1
        while (f"lyrics_part_{i}" in request.form):
            section = request.form.get(f"lyrics_section_{i}")
            part    = request.form.get(f"lyrics_part_{i}")
            if section and part:
                lyrics_parts.append({"section": section, "lyrics": part})
            i += 1

    context: Context = {
        "lyrics_parts": lyrics_parts or [],
    }
    log.debug(f"Rendering {const.ROUTES.lyrics.bp_name} page...")
    return render_template(const.ROUTES.lyrics.view_filename, **context)

@bp_lyrics.route(const.ROUTES.lyrics.path, methods=["GET"])
def renderLyrics() -> RenderView:
    """ Renders the lyrics page.
    :return: [RenderView] The rendered view.
    """
    if genius is None:
        return renderRedirection(const.ROUTES.home.view_filename, const.ERR_GENIUS_TOKEN)

    log.debug(f"Rendering {const.ROUTES.lyrics.bp_name} page...")
    return render_template(const.ROUTES.lyrics.view_filename, **const.DEFAULT_CONTEXT)
