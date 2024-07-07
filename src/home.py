from flask import Blueprint, render_template, request

from src.logger import log
from src.soft_utils import getPluralMarks
from src.statistics import JsonDict, getJsonStatsFromFile
import src.constants as constants

from src.app import app
bp_home = Blueprint('home', __name__.split('.')[-1])
session = app.config

@bp_home.route('/home')
def home() -> str:
    stats: JsonDict = getJsonStatsFromFile()
    plurals: dict[str, str] = getPluralMarks(stats)
    for key in constants.AVAILABLE_STATS:
        if (key not in stats):
            stats[key] = constants.EMPTY_STATS[key]
    return render_template('home.html', stats=stats, pluralMarks=plurals)

@app.errorhandler(404)
def page_not_found(_e: Exception) -> str:
    log.warn(f"Page not found: {request.url}. Redirecting to home page ({'/home'}).")
    return render_template('home.html', stats={}, pluralMarks={})