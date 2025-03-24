from flask import Blueprint, Response, request
from flask_cors import cross_origin
from flask_restx import Resource
from requests import get as requestsGet, Response as RequestsResponse

from ast import literal_eval
from time import time
from typing import Optional

from src.constants.enums import HttpStatus
from src.constants.paths import ROUTES
from src.constants.responses import Error, Success

from src.decorators import retry
from src.docs import models, ns_artwork_generation
from src.l10n import locale
from src.logger import log, SeverityLevel
from src.utils.web_utils import createApiResponse


@retry(condition=(lambda x: x.status_code == HttpStatus.OK), times=3)
def makeItunesRequest(url_to_hit: str) -> RequestsResponse:
    return requestsGet(url_to_hit)


def validateItunesParameters(term: str, country: str) -> Optional[str]:
    """Checks the validity of the provided iTunes parameters
    :param term: [str] The search term to be used in the iTunes API request
    :param country: [str] The country code to be used in the iTunes API request
    :return: [str | None] An error message if the parameters are invalid, or None if they are valid
    """
    if term is None or country is None or len(term.strip()) == 0 or len(country.strip()) == 0:
        return locale.get(Error.ITUNES_MISSING_PARAMS)
    if not (len(country) == 2 and country.isalpha()):
        return locale.get(Error.ITUNES_INVALID_COUNTRY)
    return None

bp_artwork_generation_itunes_search = Blueprint("search-itunes", __name__.split('.')[-1])

# iTunes reference: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW1
# Ben Dodson's iTunes artwork finder which we mimic: https://github.com/bendodson/itunes-artwork-finder
@ns_artwork_generation.route("/search-itunes")
class ItunesSearchResource(Resource):
    @cross_origin()
    @ns_artwork_generation.doc("post_search_itunes")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["search-itunes"]["payload"])
    @ns_artwork_generation.response(HttpStatus.OK, locale.get(Success.ITUNES_FETCH_COMPLETE))
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, "\n".join([locale.get(Error.ITUNES_MISSING_PARAMS), locale.get(Error.ITUNES_INVALID_COUNTRY)]))
    def post(self) -> Response:
        """Handles the request to the iTunes API to fetch possible images"""
        log.info("POST - Searching images on iTunes...")

        body = literal_eval(request.get_data(as_text=True))
        term: Optional[str] = body.get("term")
        country: Optional[str] = body.get("country")
        entity = "album"  # album by default, but can be "song", "movie", "tv-show"...
        limit = 6  # arbitrary limit for now

        err = validateItunesParameters(term, country)
        if err is not None:
            log.error(f"Error in request payload: {err}")
            return createApiResponse(HttpStatus.BAD_REQUEST, err)

        country_label = (country or "''").upper()
        log.info(f"Searching {limit} iTunes images for term: '{term}', country: {country_label}...")
        start = time()
        url_to_hit = f"https://itunes.apple.com/search?term={term}&country={country}&entity={entity}&limit={limit}"
        response = makeItunesRequest(url_to_hit)
        log.info(
            f"iTunes search complete with status code: {response.status_code}"
        ).time(SeverityLevel.INFO, time() - start)

        return createApiResponse(response.status_code, locale.get(Success.ITUNES_FETCH_COMPLETE), response.json())
