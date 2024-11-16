from flask import Blueprint
from flask_restx import Api

from server.src.docs import ns_home
from server.src.constants.paths import API_ROUTE, ROUTES

from server.src.routes.home.genius_token import bp_home_genius_token
from server.src.routes.home.statistics import bp_home_statistics

bp_home = Blueprint(ROUTES.home.bp_name, __name__.split('.')[-1])
bp_home.register_blueprint(bp_home_genius_token)
bp_home.register_blueprint(bp_home_statistics)

def addHomeNamespace(api: Api) -> None:
    """ Initializes the home blueprint """
    api_prefix = API_ROUTE
    api.add_namespace(ns_home, path=api_prefix)