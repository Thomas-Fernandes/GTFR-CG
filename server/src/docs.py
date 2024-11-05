from flask_restx import fields, Namespace

from server.src.constants.paths import ROUTES

ns_home = Namespace((ROUTES.home.bp_name or "?"), description="Home related routes")
ns_artwork_generation = Namespace((ROUTES.art_gen.bp_name or "?"), description="Artwork generation related routes")
ns_artwork_processing = Namespace((ROUTES.art_proc.bp_name or "?"), description="Artwork processing related routes")
ns_lyrics = Namespace((ROUTES.lyrics.bp_name or "?"), description="Lyrics related routes")
ns_cards_generation = Namespace((ROUTES.cards_gen.bp_name or "?"), description="Cards generation related routes")

# create a type of field for a python dictionary

class fieldsDict(fields.Raw):
    __schema_type__ = "dict"
    __schema_example__ = "{key: value}"

models = {
    ROUTES.home.bp_name: {
        "genius-token": {
            "response": ns_home.model("Home - Genius Token - response", {
                "token": fields.String(description="Genius API Token"),
            }),
        },
        "statistics": {
            "response": ns_home.model("Home - Statistics - response", {
                "date_first_operation": fields.DateTime(description="Date of the first operation (YYYY-MM-DD HH:MM:SS)"),
                "date_last_operation": fields.DateTime(description="Date of the last operation (YYYY-MM-DD HH:MM:SS)"),
                "artwork_generations": fields.Integer(description="Number of artwork generations"),
                "lyrics_fetches": fields.Integer(description="Number of lyrics fetches"),
                "cards_generated": fields.Integer(description="Number of cards generated"),
            }),
        }
    },

    ROUTES.art_gen.bp_name: {
        "search-itunes": {
            "payload": ns_artwork_generation.model("Artwork Generation - Search iTunes - payload", {
                "term": fields.String(description="Search term"),
                "country": fields.String(description="Country code (i.e. 'fr', 'nz'...)"),
            }),
            "response": ns_artwork_generation.model("Artwork Generation - Search iTunes - response", {
                "resultCount": fields.Integer(description="Number of images found"),
                "results": fields.Nested(ns_artwork_generation.model("Artwork Generation - Search iTunes - result", {
                    "artistName": fields.String(description="Name of the artist"),
                    "collectionName": fields.String(description="Name of the collection"),
                    "trackName": fields.String(description="Name of the track"),
                    "artworkUrl100": fields.String(description="URL of the artwork (100x100)"),
                })),
            }),
        },
        "use-itunes-image": {
            "payload": ns_artwork_generation.model("Artwork Generation - iTunes Image - payload", {
                "url": fields.String(description="URL of the iTunes image"),
            }),
        },
        "use-local-image": {
            "payload": ns_artwork_generation.model("Artwork Generation - Local Image - payload", {
                "file": fields.Raw(description="The local image file"),
            }),
        },
        "use-youtube-thumbnail": {
            "payload": ns_artwork_generation.model("Artwork Generation - YouTube Thumbnail - payload", {
                "url": fields.String(description="URL of the YouTube video to fetch the thumbnail from"),
            }),
        },
    },

    ROUTES.art_proc.bp_name: {
        "process-artworks": {
            "payload": ns_artwork_processing.model("Artwork Processing - Process Artworks - payload", {
                "[INFERRED] generatedArtworkPath": fields.String(description="Path to the input image"),
                "[INFERRED] includeCenterArtwork": fields.Boolean(description="Whether to include the center artwork in the cover art"),
            }),
        },
    },

    ROUTES.lyrics.bp_name: {
        "get-genius-lyrics": {
            "payload": ns_lyrics.model("Lyrics - Get Genius Lyrics - payload", {
                "songName": fields.String(description="Title of the song"),
                "artist": fields.String(description="Name of the artist"),
            }),
            "response": ns_lyrics.model("Lyrics - Get Genius Lyrics - response", {
                "lyricsParts": fields.List(fieldsDict(description="Lyrics sections")),
            }),
        },
    },

    ROUTES.cards_gen.bp_name: {
        "save-cards-contents": {
            "payload": ns_cards_generation.model("Cards Generation - Save Lyrics Contents - payload", {
                "cardsContents": fields.List(fields.List(fields.String(description="Lyric line"))),
            }),
        },
        "generate": {
            "payload": ns_cards_generation.model("Cards Generation - Generate Cards - payload", {
                "[INFERRED] cardMetaname": fields.String(description="Card metaname"),
                "outroContributors": fields.String(description="[OPTIONAL] Contributors to display on the outro card"),
                "[INFERRED] cardsContents": fields.List(fields.List(fields.String(description="Lyric line"))),
                "enforceBackgroundImage": fields.Raw(description="[OPTIONAL] Background image to enforce"),
                "includeCenterArtwork": fields.Boolean(description="[OPTIONAL] Whether to include the center artwork in the cover art"),
                "enforceBottomColor": fields.Boolean(description="[OPTIONAL] Bottom color to enforce"),
                "genOutro": fields.Boolean(description="Whether to generate the outro card"),
                "includeBgImg": fields.Boolean(description="Whether to include the background image in the card"),
            }),
        },
        "generate-single": {
            "payload": ns_cards_generation.model("Cards Generation - Generate Single Card - payload", {
                "enforceBackgroundImage": fields.Raw(description="[OPTIONAL] Background image to enforce"),
                "includeCenterArtwork": fields.Boolean(description="[OPTIONAL] Whether to include the center artwork in the cover art"),
                "cardBottomColor": fields.Boolean(description="Bottom color to enforce"),
                "genOutro": fields.Boolean(description="Whether to generate the outro card"),
                "includeBgImg": fields.Boolean(description="Whether to include the background image in the card"),
                "[INFERRED] cardMetaname": fields.String(description="Card metaname"),

                "cardsContents": fields.List(fields.List(fields.String(description="New content of the card"))),
                "cardFilename": fields.String(description="Name of the file of the card to edit"),
            }),
        },
    },
}