from flask import Blueprint, render_template, request

from src.logger import log
from src.statistics import JsonDict, getJsonStatsFromFile
import src.constants as constants

from src.app import app
bp_home = Blueprint("home", __name__.split('.')[-1])
session = app.config

@staticmethod
def getPluralMarks(stats: JsonDict) -> JsonDict:
    plurals = {}
    for (key, value) in stats.items():
        plurals[key] = "s" if (value != 1 and value != 0) else ""
    return plurals

@bp_home.route("/home")
def renderHome() -> str:
    context = constants.DEFAULT_CONTEXT_HOME
    context["stats"]: JsonDict = getJsonStatsFromFile()
    context["plurals"]: JsonDict = getPluralMarks(context["stats"])
    for key in constants.AVAILABLE_STATS:
        if (key not in context["stats"]):
            context["stats"][key] = constants.EMPTY_STATS[key]
    return render_template("home.html", **context)

@app.errorhandler(404) # needs to be applied to app, not blueprint
def pageNotFound(_e: Exception) -> str:
    def extractSearchedPath(url: str) -> str:
        return "/" + '/'.join(url.split(constants.SLASH)[3:])
    log.warn(f"Page not found: {extractSearchedPath(request.url)}. Redirecting to home page ({'/home'}).")
    return render_template("home.html", **constants.DEFAULT_CONTEXT_HOME)

@bp_home.route("/")
def root() -> str:
    return render_template("home.html", **constants.DEFAULT_CONTEXT_HOME)
