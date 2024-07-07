from flask import Blueprint, render_template, request

from src.functions import getLyrics

from src.app import app
bp_lyrics = Blueprint('lyrics', __name__.split('.')[-1])
session = app.config

@bp_lyrics.route('/lyrics', methods=['GET', 'POST'])
def lyrics() -> str:
    if (request.method != 'POST'):
        return render_template('lyrics.html', lyrics="")

    artist = request.form.get('artist', None)
    song = request.form.get('song', None)
    lyrics_text = request.form.get('lyrics')

    if (artist is not None and song is not None):
        lyrics_text = getLyrics(song, artist)

    return render_template('lyrics.html', lyrics=lyrics_text)