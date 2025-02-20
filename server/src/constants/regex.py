from re import compile

# Patterns for lyricsGenius prints
LYRICSGENIUS_PATTERNS = [
    (
        compile(r"Searching for \"(.*)\" by (.*)..."),
        lambda m: f"Lyrics for \"{m.group(1)}\" by {m.group(2)} are being searched...",
    ),
    (compile(r"Searching for \"(.*)\"..."), lambda m: f"Lyrics for \"{m.group(1)}\" are being searched..."),
    (compile(r"No results found for: \"(.*)\""), lambda m: f"No results found for \"{m.group(1)}\"."),
    (
        compile(r"Specified song does not contain lyrics. Rejecting."),
        lambda m: "The specified song does not contain lyrics and was rejected.",
    ),
    (
        compile(r"Specified song does not have a valid lyrics. Rejecting."),
        lambda m: "The specified song does not have valid lyrics and was rejected.",
    ),
]

# YouTube URL regex
REGEX_YOUTUBE_URL = [
    compile(r'https?://(?:www\.)?youtube\.com/watch\?.*?v=([a-zA-Z0-9_-]{11})'),  # Normal url
    compile(r'https?://youtu\.be/([a-zA-Z0-9_-]{11})'),  # Short url
]
