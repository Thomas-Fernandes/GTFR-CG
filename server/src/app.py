# Installed libraries
from flask import Flask, request, Response
from flask_cors import CORS
from flask_restx import Api
from flask_session import Session
from waitress import serve

# Python standard libraries
from os import makedirs

# Local modules
from server.src.cache import cacheCleanup
from server.src.constants.paths import \
    API_ROUTE, DEFAULT_PORT, FRONT_PROCESSED_ARTWORKS_DIR, FRONT_PROCESSED_CARDS_DIR, \
    HOST_HOME, SESSION_FILE_DIR, SESSION_TYPE
from server.src.logger import log
from server.src.statistics import onLaunch as printInitStatistics

# Application initialization
global app, api, session
app = Flask(__name__.split('.')[-1]) # so that the app name is app, not {dirpath}.app
CORS(app)
session = app.config
api = Api(app, doc="/docs", version="1.0", title="GTFR-CG API Documentation",
    description="Swagger API Documentation for GTFR-CG")
api.init_app(app, add_specs=False)

@app.before_request
def handle_preflight() -> Response | None:
    if request.method != "OPTIONS":
        return None
    response = app.make_default_options_response()
    headers = response.headers
    headers["Access-Control-Allow-Origin"] = "http://localhost:4242"
    headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    headers["Access-Control-Allow-Credentials"] = "true"
    return response

def initApp() -> None:
    """ Initializes the Flask app: declares config and session, assigns blueprints """
    log.debug("Initializing app...")

    def addNamespaces() -> None:
        """ Adds the routing namespaces to the app """
        log.debug("  Adding namespaces...")

        from server.src.routes.artwork_generation.artwork_generation import addArtworkGenerationNamespace
        from server.src.routes.artwork_processing.artwork_processing import addArtworkProcessingNamespace
        from server.src.routes.cards_generation.cards_generation import addCardsGenerationNamespace
        from server.src.routes.home.home import addHomeNamespace
        from server.src.routes.lyrics.lyrics import addLyricsNamespace
        namespaceAdders = [
            addArtworkGenerationNamespace,
            addArtworkProcessingNamespace,
            addCardsGenerationNamespace,
            addHomeNamespace,
            addLyricsNamespace,
        ]
        for addNamespace in namespaceAdders:
            addNamespace(api)
        log.debug(f"  Namespaces added: ["
            f"{', '.join([addNamespace.__name__[3:].replace("Namespace", "") for addNamespace in namespaceAdders])}"
        "].")
    addNamespaces()

    def logRegisteredRoutes() -> None:
        """ Logs all registered routes in the Flask app """
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append(f"./{rule.endpoint.split("_")[0]}/{rule.rule.split('/')[-1]}")
        log.debug(f"  Registered {len(routes)} routes for {API_ROUTE}: [")
        for r in routes:
            log.debug(f"    {r}")
        log.debug("  ]")
    logRegisteredRoutes()

    makedirs(FRONT_PROCESSED_ARTWORKS_DIR, exist_ok=True)
    makedirs(FRONT_PROCESSED_CARDS_DIR, exist_ok=True)
    session["SESSION_PERMANENT"] = False
    session["SESSION_TYPE"] = SESSION_TYPE
    session["SESSION_FILE_DIR"] = SESSION_FILE_DIR
    Session(app)
    log.debug("App initialized.")

def main(host: str = HOST_HOME, port: int = DEFAULT_PORT) -> None:
    f""" Main function to clean the cache, initialize the server and start it
    :param host: [string] The host address to run the server on (default: "{HOST_HOME}")
    :param port: [integer] The port to run the server on (default: {DEFAULT_PORT})
    """
    host_display_name = "localhost" if host == HOST_HOME else host
    log.log(f"Starting server @ http://{host_display_name}:{port}...")

    printInitStatistics()
    cacheCleanup(session)
    initApp()
    serve(app, host=host, port=port, threads=8)
