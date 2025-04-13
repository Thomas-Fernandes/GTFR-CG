from flask import Blueprint
from flask_restx import Api

from src.constants.paths import API_ROUTE, ROUTES

from src.docs import ns_lyrics

from src.routes.lyrics.get_genius_lyrics import bp_lyrics_get_genius_lyrics

bp_lyrics = Blueprint(ROUTES.home.bp_name, __name__.split('.')[-1])
bp_lyrics.register_blueprint(bp_lyrics_get_genius_lyrics)


def addLyricsNamespace(api: Api) -> None:
    """Initializes the lyrics blueprint"""
    api_prefix = API_ROUTE + ROUTES.lyrics.path
    api.add_namespace(ns_lyrics, path=api_prefix)
