from enum import StrEnum


class Error(StrEnum):
    USER_FOLDER_NOT_FOUND = "USER_FOLDER_NOT_FOUND"
    GENIUS_TOKEN_NOT_FOUND = "GENIUS_TOKEN_NOT_FOUND"
    LOCALE_MISSING_PARAMS = "LOCALE_MISSING_PARAMS"
    STATS_FILETYPE = "STATS_FILETYPE"
    ITUNES_MISSING_PARAMS = "ITUNES_MISSING_PARAMS"
    ITUNES_INVALID_COUNTRY = "ITUNES_INVALID_COUNTRY"
    NO_FILE = "NO_FILE"
    NO_IMG = "NO_IMG"
    IMG_INVALID_FILETYPE = "IMG_INVALID_FILETYPE"
    NO_IMG_URL = "NO_IMG_URL"
    INVALID_YT_URL = "INVALID_YT_URL"
    OVERLAY_NOT_FOUND = "OVERLAY_NOT_FOUND"
    FAIL_DOWNLOAD = "FAIL_DOWNLOAD"
    LYRICS_MISSING_PARAMS = "LYRICS_MISSING_PARAMS"
    LYRICS_NOT_FOUND = "LYRICS_NOT_FOUND"
    CARDS_PARAMS_NOT_FOUND = "CARDS_PARAMS_NOT_FOUND"
    CARDS_CONTENTS_NOT_FOUND = "CARDS_CONTENTS_NOT_FOUND"
    CARDS_CONTENTS_INVALID = "CARDS_CONTENTS_INVALID"
    CARDS_CONTENTS_SAVE_FAILED = "CARDS_CONTENTS_SAVE_FAILED"
    CARDS_CONTENTS_READ_FAILED = "CARDS_CONTENTS_READ_FAILED"
    CARDS_METANAME_NOT_FOUND = "CARDS_METANAME_NOT_FOUND"
    CARDS_CENTER_ARTWORK_NOT_FOUND = "CARDS_CENTER_ARTWORK_NOT_FOUND"
    CARDS_BACKGROUND_NOT_FOUND = "CARDS_BACKGROUND_NOT_FOUND"
    CARDS_COLOR_NOT_FOUND = "CARDS_COLOR_NOT_FOUND"
    CARDS_FILENAME_NOT_FOUND = "CARDS_FILENAME_NOT_FOUND"


class Warn(StrEnum):
    NO_USER_FOLDER = "NO_USER_FOLDER"
    LOCALE_INVALID = "LOCALE_INVALID"

class Success(StrEnum):
    LOCALE_CHANGED = "LOCALE_CHANGED"
    GENIUS_TOKEN_FETCHED = "GENIUS_TOKEN_FETCHED"
    STATS_FETCHED = "STATS_FETCHED"
    STATS_CREATED = "STATS_CREATED"
    ITUNES_FETCH_COMPLETE = "ITUNES_FETCH_COMPLETE"
    ITUNES_IMAGE_UPLOADED = "ITUNES_IMAGE_UPLOADED"
    LOCAL_IMAGE_UPLOADED = "LOCAL_IMAGE_UPLOADED"
    YOUTUBE_IMAGE_UPLOADED = "YOUTUBE_IMAGE_UPLOADED"
    PROCESSED_IMAGES_SUCCESS = "PROCESSED_IMAGES_SUCCESS"
    LYRICS_FETCH_SUCCESS = "LYRICS_FETCH_SUCCESS"
    CARDS_CONTENTS_SAVED = "CARDS_CONTENTS_SAVED"
    CARDS_GENERATED = "CARDS_GENERATED"
    CARD_GENERATED = "CARD_GENERATED"