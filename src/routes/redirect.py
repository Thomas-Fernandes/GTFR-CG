from flask import Blueprint, render_template

from os import path

from src.logger import log
from src.typing import Context, RenderView
import src.constants as const

from src.app import app
bp_redirect = Blueprint(const.ROUTES.redirect.bp_name, __name__.split('.')[-1])
session = app.config

@bp_redirect.route(const.ROUTES.proc_img.path + "/ERROR-no-img", methods=["GET"])
def renderProcessedImagesNoImg(err: str = const.ERR_NO_IMG) -> RenderView:
    log.warn(f"Redirecting to home page ({const.ROUTES.home.path}) "
             f"following error: \"{err}\".")
    context: Context = {
        "err": err,
    }
    return render_template(const.ROUTES.redirect.view_filename, **context)
