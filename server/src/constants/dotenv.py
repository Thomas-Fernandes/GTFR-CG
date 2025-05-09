from dotenv import load_dotenv

from os import getenv
from re import compile
from typing import Optional

load_dotenv()
LOGGER_LEVEL: Optional[str] = getenv("LOGGER_SEVERITY")
GENIUS_API_TOKEN: Optional[str] = getenv("GENIUS_API_TOKEN")
GENIUS_API_TOKEN_PATTERN = compile(r"^[a-zA-Z0-9\-_]{64}$")
