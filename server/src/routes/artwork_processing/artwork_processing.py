from flask import Blueprint
from flask_restx import Api

from server.src.docs import ns_artwork_processing
from server.src.constants.paths import API_ROUTE, ROUTES

from server.src.routes.artwork_processing.process_artworks import bp_artwork_processing_process_artworks

bp_artwork_processing = Blueprint(ROUTES.art_proc.bp_name, __name__.split('.')[-1])
bp_artwork_processing.register_blueprint(bp_artwork_processing_process_artworks)

def addArtworkProcessingNamespace(api: Api) -> None:
    """ Initializes the artwork processing blueprint """
    api_prefix = API_ROUTE + ROUTES.art_proc.path
    api.add_namespace(ns_artwork_processing, path=api_prefix)