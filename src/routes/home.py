from flask import Blueprint, render_template, request

from src.logger import log
from src.statistics import JsonDict, getJsonStatsFromFile
import src.constants as constants

from src.app import app
bp_home = Blueprint('home', __name__.split('.')[-1])
session = app.config

@staticmethod
def getPluralMarks(stats: JsonDict) -> JsonDict:
    plurals = {}
    for (key, value) in stats.items():
        plurals[key] = "s" if (value != 1 and value != 0) else ""
    return plurals

@bp_home.route('/home')
def renderHome() -> str:
    stats: JsonDict = getJsonStatsFromFile()
    plurals: JsonDict = getPluralMarks(stats)
    for key in constants.AVAILABLE_STATS:
        if (key not in stats):
            stats[key] = constants.EMPTY_STATS[key]
    return render_template('home.html', stats=stats, pluralMarks=plurals)

@bp_home.errorhandler(404)
def pageNotFound(_e: Exception) -> str:
    log.warn(f"Page not found: {request.url}. Redirecting to home page ({'/home'}).")
    return render_template('home.html', stats={}, pluralMarks={})

@bp_home.route('/')
def root() -> str:
    return render_template('home.html', stats={}, pluralMarks={})
