from dotenv import load_dotenv

from os import getenv
from re import compile
from typing import Optional

load_dotenv()
LOGGER_SEVERITY: Optional[str] = getenv("LOGGER_SEVERITY")
GENIUS_API_TOKEN: Optional[str] = getenv("GENIUS_API_TOKEN")
GENIUS_API_TOKEN_PATTERN = compile(r"^[a-zA-Z0-9]{15}-[a-zA-Z0-9]{34}-[a-zA-Z0-9]{13}$")