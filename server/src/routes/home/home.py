from flask import Blueprint
from flask_restx import Api

from src.docs import ns_home
from src.constants.paths import API_ROUTE, ROUTES

from src.routes.home.genius_token import bp_home_genius_token
from src.routes.home.l10n import bp_home_locale
from src.routes.home.statistics import bp_home_statistics

bp_home = Blueprint(ROUTES.home.bp_name, __name__.split('.')[-1])
bp_home.register_blueprint(bp_home_genius_token)
bp_home.register_blueprint(bp_home_locale)
bp_home.register_blueprint(bp_home_statistics)

def addHomeNamespace(api: Api) -> None:
    """ Initializes the home blueprint """
    api_prefix = API_ROUTE
    api.add_namespace(ns_home, path=api_prefix)