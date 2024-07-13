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
    session["genius_token"] = const.GENIUS_API_TOKEN
except TypeError as e:
    log.error(f"Error while creating Genius object: {e}. "
              "Lyrics fetching will not work.")

@staticmethod
def fetchLyricsFromGenius(song_title: str, artist_name: str) -> str:
    if genius is None:
        return const.ERR_GENIUS_TOKEN

    song: Optional[Genius.Song] = None
    try:
        with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
            song = genius.search_song(song_title, artist_name)
    except ReadTimeoutException as e:
        log.error(f"Lyrics fetch failed: {e}")
    if song is None:
        return "Lyrics not found."

    lyrics = song.lyrics
    # Removing charabia at the beginning and end of the lyrics
    lyrics = sub(r"^.*Lyrics\[", '[', lyrics).strip()
    lyrics = sub(r"\d+Embed$", '', lyrics).strip()

    # Ensure double newline before song parts
    def add_newline_before_song_parts(lyrics: str) -> str:
        song_parts = split(r"<[^>]+>", lyrics)
        new_lyrics = []
        for (i, part) in enumerate(song_parts):
            if match(r'"[^"]*"', part):
                if i == 0 or song_parts[i-1].endswith("\n\n") or song_parts[i-1].strip() == "":
                    new_lyrics.append(part)
                else:
                    new_lyrics.append("\n\n" + part)
            else:
                new_lyrics.append(part)
        return ''.join(new_lyrics)

    lyrics = add_newline_before_song_parts(lyrics)
    updateStats(to_increment="lyricsFetches")

    return lyrics

@bp_lyrics.route(const.ROUTES.lyrics.path, methods=["POST"])
def updateTextarea() -> RenderView:
    artist: Optional[str] = request.form.get("artist", None)
    song: Optional[str] = request.form.get("song", None)
    lyrics_text: Optional[str] = request.form.get("lyrics")

    if artist is not None and song is not None:
        lyrics_text = fetchLyricsFromGenius(song, artist)

    context: Context = {
        "lyrics": lyrics_text,
    }
    return render_template(const.ROUTES.lyrics.view_filename, **context)

@bp_lyrics.route(const.ROUTES.lyrics.path, methods=["GET"])
def renderLyrics() -> RenderView:
    if genius is None:
        return renderRedirection(const.ROUTES.home.view_filename, const.ERR_GENIUS_TOKEN)

    return render_template(const.ROUTES.lyrics.view_filename, **const.DEFAULT_CONTEXT)
