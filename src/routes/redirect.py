from flask import Blueprint, render_template

from src.logger import log
from src.typing import Context, RenderView
import src.constants as const

from src.app import app
bp_redirect = Blueprint(const.ROUTES.redirect.bp_name, __name__.split('.')[-1])
session = app.config

@bp_redirect.route(const.ROUTES.redirect.path, methods=["GET"])
def renderRedirection(redirectTo: str, err: str) -> RenderView:
    log.warn(f"Redirecting to page \"{redirectTo}\" "
             f"following error: \"{err}\"...")
    context: Context = {
        "redirectTo": redirectTo.replace(".html", ""),
        "errorText": err,

        "plural": "s",
    }
    return render_template(const.ROUTES.redirect.view_filename, **context)
