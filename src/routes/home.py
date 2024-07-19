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
    """ Determines whether statistics' units should be pluralized.
    :param stats: [JsonDict] The statistics to check.
    :return: [JsonDict] The plural mark for each unit.
    """
    plurals = {}
    for (key, value) in stats.items():
        plurals[key] = "s" if (value != 1 and value != 0) else ""
    return plurals

@bp_home.route(const.ROUTES.home.path)
def renderHome() -> RenderView:
    context = const.DEFAULT_CONTEXT_OBJ
    context.stats = getJsonStatsFromFile()
    context.plurals = getPluralMarks(context.stats)
    context.genius_token = session.get(const.SessionFields.genius_token.value, const.DEFAULT_CONTEXT_OBJ.genius_token)
    context.session_status = session.get(const.SessionFields.session_status.value, const.DEFAULT_CONTEXT_OBJ.session_status)
    for key in const.AvailableStats: # fill missing stats with default values
        if key.value not in context.stats:
            context.stats[key.value] = const.EMPTY_STATS[key.value]
    if context.session_status == "initializing":
        session[const.SessionFields.session_status.value] = "running"
    return render_template(const.ROUTES.home.view_filename, **context.__dict__)

@app.errorhandler(const.HttpStatus.NOT_FOUND.value) # needs to be applied to app, not blueprint
def pageNotFound(_e: Exception) -> RenderView:
    """ Redirects to the home page if the requested page is not found.
    :param _e: [Exception] The exception that occurred. Not used.
    :return: [RenderView] The home page.
    """
    @staticmethod
    def extractSearchedPath(url: str) -> str:
        """ Extracts the searched path from the URL, excluding the domain.
        :param url: [str] The complete URL.
        :return: [str] The searched path.
        """
        return "/" + '/'.join(url.split(const.SLASH)[3:])
    log.warn(f"Page not found: {extractSearchedPath(request.url)}. "
             f"Redirecting to home page ({const.ROUTES.home.path}).")
    return render_template(const.ROUTES.home.view_filename, **const.DEFAULT_CONTEXT)

@bp_home.route("/")
def root() -> RenderView:
    """ Flask's root route, directly redirects to the home page.
    :return: [RenderView] The home page.
    """
    return render_template(const.ROUTES.home.view_filename, **const.DEFAULT_CONTEXT)
