# Installed libraries
from flask import Flask, request, Response, send_from_directory
from flask_cors import CORS
from flask_restx import Api
from flask_session import Session
from waitress import serve

# Python standard libraries

# Local modules
from src.cache import cacheCleanup
from src.constants.paths import DEFAULT_PORT, HOST_HOME, SESSION_FILE_DIR, SESSION_TYPE
from src.logger import log
from src.statistics import onLaunch as printInitStatistics

# Application initialization
global app, api, session
app = Flask(__name__.split(".")[-1])  # so that the app name is app, not {dirpath}.app
CORS(app)
session = app.config
api = Api(
    app,
    doc="/docs",
    version="1.0",
    title="GTFR-CG API Documentation",
    description="Swagger API Documentation for GTFR-CG",
)
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


@app.route("/api/files/<path:filename>")
def serve_file(filename: str) -> Response:
    return send_from_directory("/app/generated_files", filename)


def initApp() -> None:
    """Initializes the Flask app: declares config and session, assigns blueprints"""
    log.debug("Initializing app...")

    def addNamespaces() -> None:
        """Adds the routing namespaces to the app"""
        log.debug("  Adding namespaces...")

        from src.routes.artwork_generation.artwork_generation import addArtworkGenerationNamespace
        from src.routes.artwork_processing.artwork_processing import addArtworkProcessingNamespace
        from src.routes.cards_generation.cards_generation import addCardsGenerationNamespace
        from src.routes.home.home import addHomeNamespace
        from src.routes.lyrics.lyrics import addLyricsNamespace

        namespaceAdders = [
            addArtworkGenerationNamespace,
            addArtworkProcessingNamespace,
            addCardsGenerationNamespace,
            addHomeNamespace,
            addLyricsNamespace,
        ]
        for addNamespace in namespaceAdders:
            addNamespace(api)
        namespace_names: str = ", ".join(
            [addNamespace.__name__[3:].replace("Namespace", "") for addNamespace in namespaceAdders]
        )
        log.debug(f"  Namespaces added: [{namespace_names}].")

    addNamespaces()

    def logRegisteredRoutes() -> None:
        """Logs all registered routes in the Flask app"""
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append(f".{rule.rule}")
        log.debug(f"  Registered {len(routes)} routes: [")
        for r in routes:
            log.debug(f"    {r}")
        log.debug("  ]")

    logRegisteredRoutes()

    session["SESSION_PERMANENT"] = False
    session["SESSION_TYPE"] = SESSION_TYPE
    session["SESSION_FILE_DIR"] = SESSION_FILE_DIR
    Session(app)
    log.debug("App initialized.")


def main(host: str = HOST_HOME, port: int = DEFAULT_PORT) -> None:
    f"""Main function to clean the cache, initialize the server and start it
    :param host: [string] The host address to run the server on (default: "{HOST_HOME}")
    :param port: [integer] The port to run the server on (default: {DEFAULT_PORT})
    """
    host_display_name = "localhost" if host == HOST_HOME else host
    log.info(f"Starting server @ http://{host_display_name}:{port}...")

    printInitStatistics()
    cacheCleanup(session)
    initApp()
    serve(app, host=host, port=port, threads=8)
