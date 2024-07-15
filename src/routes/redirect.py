from flask import Blueprint, render_template

from src.logger import log
from src.typing import Context, RenderView
import src.constants as const

from src.app import app
bp_redirect = Blueprint(const.ROUTES.redirect.bp_name, __name__.split('.')[-1])
session = app.config

@bp_redirect.route(const.ROUTES.redirect.path, methods=["GET"])
def renderRedirection(redirect_to: str, err: str) -> RenderView:
    """ Renders the redirection page with the given parameters.
    :param redirect_to: [string] The path of the page to redirect to.
    :param err: [string] The error message to display.
    :return: [RenderView] The rendered view.
    """
    log.warn(f"Redirecting to page \"{redirect_to}\" "
             f"following error: \"{err}\"...")
    context: Context = {
        "redirect_to": redirect_to,
        "errorText": err,

        "plural": "s" if err == const.ERR_NO_IMG else None,
    }
    return render_template(const.ROUTES.redirect.view_filename, **context)
