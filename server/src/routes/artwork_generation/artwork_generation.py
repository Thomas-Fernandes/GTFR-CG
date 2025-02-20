from flask import Blueprint
from flask_restx import Api

from src.docs import ns_artwork_generation
from src.constants.paths import API_ROUTE, ROUTES

from src.routes.artwork_generation.itunes_image import bp_artwork_generation_itunes_image
from src.routes.artwork_generation.itunes_search import bp_artwork_generation_itunes_search
from src.routes.artwork_generation.local_file import bp_artwork_generation_local_file
from src.routes.artwork_generation.youtube_thumbnail import bp_artwork_generation_youtube_thumbnail

bp_artwork_generation = Blueprint(ROUTES.art_gen.bp_name, __name__.split('.')[-1])
bp_artwork_generation.register_blueprint(bp_artwork_generation_itunes_search)
bp_artwork_generation.register_blueprint(bp_artwork_generation_itunes_image)
bp_artwork_generation.register_blueprint(bp_artwork_generation_local_file)
bp_artwork_generation.register_blueprint(bp_artwork_generation_youtube_thumbnail)


def addArtworkGenerationNamespace(api: Api) -> None:
    """Initializes the artwork generation blueprint"""
    api_prefix = API_ROUTE + ROUTES.art_gen.path
    api.add_namespace(ns_artwork_generation, path=api_prefix)
