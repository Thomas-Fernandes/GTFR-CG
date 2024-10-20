from flask_restx import fields, Namespace

import src.constants as const

ns_home = Namespace((const.ROUTES.home.bp_name or "?"), description="Home related routes")
ns_processed_images = Namespace((const.ROUTES.proc_img.bp_name or "?"), description="Images processing related routes")
ns_cards_generation = Namespace((const.ROUTES.cards_gen.bp_name or "?"), description="Cards generation related routes")

models = {
    # Home
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

    # Images processing
    "process-images": ns_processed_images.model("Process Images", {
        "generated_artwork_path": fields.String(description="[INFERRED] Path to the input image"),
        "include_center_artwork": fields.Boolean(description="[INFERRED] Whether to include the center artwork in the cover art"),
    }),

    # Cards generation
    "save-contents": ns_cards_generation.model("Save Contents", {
        "song_metadata": fields.Nested(ns_cards_generation.model("Song Metadata", {
            "title": fields.String(description="Title of the song"),
            "artist": fields.String(description="Artist of the song"),
            "album": fields.String(description="Album of the song"),
            "release_date": fields.String(description="Release date of the song"),
            "lyrics": fields.String(description="Lyrics of the song"),
        })),
        "card_metadata": fields.Nested(ns_cards_generation.model("Card Metadata", {
            "background_color": fields.String(description="Background color of the card"),
            "text_color": fields.String(description="Text color of the card"),
            "font_size": fields.Integer(description="Font size of the card"),
            "font_family": fields.String(description="Font family of the card"),
            "text_position": fields.String(description="Text position on the card"),
        })),
        "contributor_logins": fields.List(fields.String(description="Contributors' logins")),
    }),
    "generate": ns_cards_generation.model("Generate Cards", {
        "output_path": fields.String(description="Output path of the card"),
        "contributor_logins": fields.List(fields.String(description="Contributors' logins")),
    }),
}