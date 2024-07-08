from flask import Blueprint, render_template, request

from src.logger import log
from src.statistics import JsonDict, getJsonStatsFromFile
from src.typing import RenderView
import src.constants as constants

from src.app import app
bp_home = Blueprint(constants.ROUTES.home.bp_name, __name__.split('.')[-1])
session = app.config

@staticmethod
def getPluralMarks(stats: JsonDict) -> JsonDict:
    plurals = {}
    for (key, value) in stats.items():
        plurals[key] = "s" if (value != 1 and value != 0) else ""
    return plurals

@bp_home.route(constants.ROUTES.home.path)
def renderHome() -> RenderView:
    context = constants.DEFAULT_CONTEXT
    context["stats"] = getJsonStatsFromFile()
    context["plurals"] = getPluralMarks(context["stats"])
    for key in constants.AVAILABLE_STATS:
        if key not in context["stats"]:
            context["stats"][key] = constants.EMPTY_STATS[key]
    return render_template(constants.ROUTES.home.view_filename, **context)

@app.errorhandler(constants.HttpStatus.NOT_FOUND.value) # needs to be applied to app, not blueprint
def pageNotFound(_e: Exception) -> RenderView:
    def extractSearchedPath(url: str) -> str:
        return "/" + '/'.join(url.split(constants.SLASH)[3:])
    log.warn(f"Page not found: {extractSearchedPath(request.url)}. "
             f"Redirecting to home page ({constants.ROUTES.home.path}).")
    return render_template(constants.ROUTES.home.view_filename, **constants.DEFAULT_CONTEXT)

@bp_home.route("/")
def root() -> RenderView:
    return render_template(constants.ROUTES.home.view_filename, **constants.DEFAULT_CONTEXT)
