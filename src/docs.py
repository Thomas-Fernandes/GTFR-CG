from flask_restx import fields, Namespace

import src.constants as const

ns_home = Namespace((const.ROUTES.home.bp_name or "").title(), description="Home related routes")
models = {
    "genius-token": ns_home.model("Genius Token", {
        "token": fields.String(description="Genius API Token"),
    }),
    "statistics": ns_home.model("Statistics", {
        "date_first_operation": fields.DateTime(description="Date of the first operation (YYYY-MM-DD HH:MM:SS)"),
        "date_last_operation": fields.DateTime(description="Date of the last operation (YYYY-MM-DD HH:MM:SS)"),
        "artwork_generations": fields.Integer(description="Number of artwork generations"),
        "lyrics_fetches": fields.Integer(description="Number of lyrics fetches"),
        "cards_generated": fields.Integer(description="Number of cards generated"),
    }),
}