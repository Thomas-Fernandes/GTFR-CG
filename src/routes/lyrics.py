from flask import Blueprint, render_template, request

from lyricsgenius import Genius
from re import sub, split, match
from typing import Optional

from src.logger import log
from src.statistics import updateStats
from src.typing import Context, RenderView
import src.constants as constants

from src.app import app
bp_lyrics = Blueprint(constants.ROUTES.lyrics.bp_name, __name__.split('.')[-1])
session = app.config

genius = Genius(constants.GENIUS_API_TOKEN)

@staticmethod
def fetchLyricsFromGenius(song_title: str, artist_name: str) -> str:
    song: Optional[Genius.Song] = None
    with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
        song = genius.search_song(song_title, artist_name)

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

@bp_lyrics.route(constants.ROUTES.lyrics.path, methods=["POST"])
def updateTextarea() -> RenderView:
    artist = request.form.get("artist", None)
    song = request.form.get("song", None)
    lyrics_text = request.form.get("lyrics")

    if artist is not None and song is not None:
        lyrics_text = fetchLyricsFromGenius(song, artist)

    context: Context = {
        "lyrics": lyrics_text,
    }
    return render_template(constants.ROUTES.lyrics.view_filename, **context)

@bp_lyrics.route(constants.ROUTES.lyrics.path, methods=["GET"])
def renderLyrics() -> RenderView:
    return render_template(constants.ROUTES.lyrics.view_filename, **constants.DEFAULT_CONTEXT)
