from flask_restx import fields, Namespace

import src.constants as const

ns_home = Namespace((const.ROUTES.home.bp_name or "?"), description="Home related routes")
ns_artwork_generation = Namespace((const.ROUTES.art_gen.bp_name or "?"), description="Artwork generation related routes")
ns_artwork_processing = Namespace((const.ROUTES.art_proc.bp_name or "?"), description="Artwork processing related routes")
ns_lyrics = Namespace((const.ROUTES.lyrics.bp_name or "?"), description="Lyrics related routes")
ns_cards_generation = Namespace((const.ROUTES.cards_gen.bp_name or "?"), description="Cards generation related routes")

models = {
    const.ROUTES.home.bp_name: {
        "genius-token": ns_home.model("Home - Genius Token", {
            "token": fields.String(description="Genius API Token"),
        }),
        "statistics": ns_home.model("Home - Statistics", {
            "date_first_operation": fields.DateTime(description="Date of the first operation (YYYY-MM-DD HH:MM:SS)"),
            "date_last_operation": fields.DateTime(description="Date of the last operation (YYYY-MM-DD HH:MM:SS)"),
            "artwork_generations": fields.Integer(description="Number of artwork generations"),
            "lyrics_fetches": fields.Integer(description="Number of lyrics fetches"),
            "cards_generated": fields.Integer(description="Number of cards generated"),
        }),
    },

    const.ROUTES.art_gen.bp_name: {
        "use-itunes-image": ns_artwork_generation.model("Artwork generation - iTunes Image", {
            "url": fields.String(description="URL of the iTunes image"),
        }),
        "use-local-image": ns_artwork_generation.model("Artwork generation - Local Image", {
            "file": fields.Raw(description="The local image file"),
        }),
        "use-youtube-thumbnail": ns_artwork_generation.model("Artwork generation - YouTube Thumbnail", {
            "url": fields.String(description="URL of the YouTube video to fetch the thumbnail from"),
        }),
    },

    const.ROUTES.art_proc.bp_name: {
        "process-images": ns_artwork_processing.model("Artwork processing - Process Images", {
            "[INFERRED] generatedArtworkPath": fields.String(description="Path to the input image"),
            "[INFERRED] includeCenterArtwork": fields.Boolean(description="Whether to include the center artwork in the cover art"),
        }),
    },

    const.ROUTES.lyrics.bp_name: {
        "get-genius-lyrics": ns_lyrics.model("Lyrics - Get Genius Lyrics", {
            "songName": fields.String(description="Title of the song"),
            "artist": fields.String(description="Name of the artist"),
        }),
    },

    const.ROUTES.cards_gen.bp_name: {
        "save-cards-contents": ns_cards_generation.model("Cards generation - Save Lyrics Contents", {
            "cardsContents": fields.List(fields.List(fields.String(description="Lyric line"))),
        }),
        "generate": ns_cards_generation.model("Cards generation - Generate Cards", {
            "[INFERRED] cardsContents": fields.List(fields.List(fields.String(description="Lyric line"))),
            "enforceBackgroundImage": fields.Raw(required=False, description="Background image to enforce"),
            "includeCenterArtwork": fields.Boolean(required=False, description="Whether to include the center artwork in the cover art"),
            "enforceBottomColor": fields.Boolean(required=False, description="Bottom color to enforce"),
            "genOutro": fields.Boolean(description="Whether to generate the outro card"),
            "includeBgImg": fields.Boolean(description="Whether to include the background image in the card"),
            "[INFERRED] cardMetaname": fields.String(description="Card metaname"),
        }),
    },
}