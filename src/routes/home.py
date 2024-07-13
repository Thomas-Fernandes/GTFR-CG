from flask import Blueprint, render_template, request

import src.constants as const
from src.logger import log
from src.statistics import JsonDict, getJsonStatsFromFile
from src.typing import RenderView

from src.app import app
bp_home = Blueprint(const.ROUTES.home.bp_name, __name__.split('.')[-1])
session = app.config

@staticmethod
def getPluralMarks(stats: JsonDict) -> JsonDict:
    plurals = {}
    for (key, value) in stats.items():
        plurals[key] = "s" if (value != 1 and value != 0) else ""
    return plurals

@bp_home.route(const.ROUTES.home.path)
def renderHome() -> RenderView:
    context = const.DEFAULT_CONTEXT
    context["stats"] = getJsonStatsFromFile()
    context["plurals"] = getPluralMarks(context["stats"])
    context["genius_token"] = session.get("genius_token", "")
    context["session_state"] = session.get("session_state", "initializing")
    for key in const.AVAILABLE_STATS: # fill missing stats with default values
        if key not in context["stats"]:
            context["stats"][key] = const.EMPTY_STATS[key]
    if context["session_state"] == "initializing":
        session["session_state"] = "running"
    return render_template(const.ROUTES.home.view_filename, **context)

@app.errorhandler(const.HttpStatus.NOT_FOUND.value) # needs to be applied to app, not blueprint
def pageNotFound(_e: Exception) -> RenderView:
    def extractSearchedPath(url: str) -> str:
        return "/" + '/'.join(url.split(const.SLASH)[3:])
    log.warn(f"Page not found: {extractSearchedPath(request.url)}. "
             f"Redirecting to home page ({const.ROUTES.home.path}).")
    return render_template(const.ROUTES.home.view_filename, **const.DEFAULT_CONTEXT)

@bp_home.route("/")
def root() -> RenderView:
    return render_template(const.ROUTES.home.view_filename, **const.DEFAULT_CONTEXT)
