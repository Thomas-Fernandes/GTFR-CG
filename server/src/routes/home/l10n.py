from flask import Blueprint, request, Response
from flask_restx import Resource

from ast import literal_eval
from typing import Optional

from src.constants.enums import HttpStatus
from src.constants.paths import ROUTES
from src.constants.responses import Error, Success, Warn

from src.docs import models, ns_home
from src.l10n import locale, Locale
from src.logger import log
from src.utils.web_utils import createApiResponse

def changeLocale(new_locale: Locale) -> Locale:
    """ Changes the locale of the server responses
    :param new_locale: [Locale] The new locale to use
    :return: [Locale] The new locale
    """
    return locale.set_locale(new_locale)

bp_home_locale = Blueprint("locale", __name__.split('.')[-1])


@ns_home.route("/locale")
class LocaleResource(Resource):
    @ns_home.doc("post_locale")
    @ns_home.expect(models[ROUTES.home.bp_name]["change_locale"]["payload"])
    @ns_home.response(HttpStatus.OK, locale.get(Success.LOCALE_CHANGED), models[ROUTES.home.bp_name]["change_locale"]["response"])
    @ns_home.response(HttpStatus.CONTENT_DIFFERENT, locale.get(Warn.LOCALE_INVALID), models[ROUTES.home.bp_name]["change_locale"]["response"])
    @ns_home.response(HttpStatus.BAD_REQUEST, locale.get(Error.LOCALE_MISSING_PARAMS))
    def post(self) -> Response:
        """ Changes the server response locale """
        log.debug("POST - Changing the server response locale...")

        body = literal_eval(request.get_data(as_text=True))
        body_locale: Optional[Locale] = body.get("locale")
        new_locale: Optional[str] = next((loc for loc in Locale if loc.startswith(body_locale)), None)

        if new_locale is None:
            log.error(locale.get(Error.LOCALE_MISSING_PARAMS))
            return createApiResponse(HttpStatus.BAD_REQUEST, locale.get(Error.LOCALE_MISSING_PARAMS))

        rv = changeLocale(new_locale)
        response = {
            "locale": rv,
        }
        log.info(f"Locale changed to {rv}.")

        if rv != new_locale:
            return createApiResponse(HttpStatus.CONTENT_DIFFERENT, locale.get(Warn.LOCALE_INVALID), response)
        return createApiResponse(HttpStatus.OK, locale.get(Success.LOCALE_CHANGED), response)