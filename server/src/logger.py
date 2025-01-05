from contextlib import contextmanager
from enum import IntEnum, StrEnum
from io import StringIO
import logging;
from re import Match
import sys # The whole module must be imported for output redirection to work
from typing import Iterator, Optional, Self

from src.constants.dotenv import LOGGER_LEVEL as dotenv_level
from src.constants.regex import LYRICSGENIUS_PATTERNS
from src.utils.time_utils import getNowEpoch

class SeverityLevel(IntEnum):
    """ Enum for severity levels """
    NOTSET   = logging.NOTSET
    DEBUG    = logging.DEBUG
    INFO     = logging.INFO
    WARNING  = logging.WARNING
    ERROR    = logging.ERROR
    CRITICAL = logging.CRITICAL

class SeverityPrefix(StrEnum):
    """ Enum for severity prefixes """
    DEBUG    = "DEBUG"
    INFO     = "INFO."
    WARNING  = "WARN?"
    ERROR    = "ERR?!"
    CRITICAL = "CRIT!"

class CustomFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        record.levelname = SeverityPrefix[record.levelname]
        return super().format(record)

class Logger(logging.getLoggerClass()):
    """ Logger class to log messages

    Attributes:
        __severity: [SeverityLevel] The severity level of the logger
    """
    def critical(self, msg: str) -> Self: super().log(SeverityLevel.CRITICAL, "%s", msg); return self
    def error(self,    msg: str) -> Self: super().log(SeverityLevel.ERROR,    "%s", msg); return self
    def warn(self,     msg: str) -> Self: super().log(SeverityLevel.WARNING,  "%s", msg); return self
    def info(self,     msg: str) -> Self: super().log(SeverityLevel.INFO,     "%s", msg); return self
    def debug(self,    msg: str) -> Self: super().log(SeverityLevel.DEBUG,    "%s", msg); return self

    def time(self, level: SeverityLevel, duration: float, *, padding: int = 0) -> Self:
        """ Logs a message with a timestamp
        :param level: [SeverityLevel] The severity level of the message
        :param duration: [float] The duration of the operation
        :param padding: [int?] The padding to add to the message (default: 0)
        :return: [Logger] The logger instance (for chaining)
        """
        if padding < 0: raise ValueError("Padding must be a non-negative integer.")

        if level >= self.__level:
            if duration < 1:
                if duration * 1_000 < 1:
                    display_duration = f"{round(duration * 1_000_000)} µ-seconds"
                else:
                    display_duration = f"{round(duration * 1_000)} m-seconds"
            else: display_duration = f"{round(duration, 3)} seconds"
            self.info(f"{' ' * padding}^ took {display_duration}")
        return self

    @contextmanager
    def redirect_stdout_stderr(self) -> Iterator[tuple[StringIO, StringIO]]:
        """ Redirects stdout and stderr to a StringIO buffer; the buffers are then sent to the logger
        :return: [iterator] A tuple containing the new stdout and stderr buffers
        """
        new_stdout, new_stderr = StringIO(), StringIO()
        old_stdout, old_stderr = sys.stdout, sys.stderr
        sys.stdout, sys.stderr = new_stdout, new_stderr
        try:
            yield (new_stdout, new_stderr)
        finally:
            sys.stdout, sys.stderr = old_stdout, old_stderr
            new_stdout.seek(0)
            new_stderr.seek(0)
            stdout_content = new_stdout.read()
            stderr_content = new_stderr.read()

            def process_message(line: str) -> str:
                for (pattern, action) in LYRICSGENIUS_PATTERNS:
                    match: Optional[Match[str]] = pattern.match(line)
                    if match is not None:
                        return action(match)
                return line

            (artist, song) = ("", "")
            if stdout_content is not None:
                stdout_content = stdout_content.strip()
                for line in stdout_content.splitlines():
                    processed_line = process_message(line)
                    if processed_line == "Done.":
                        self.log(f"Lyrics for {song} by {artist} were successfully found and populated.")
                    else:
                        if processed_line.startswith("Lyrics for"):
                            song = processed_line.split("Lyrics for ")[1].split(" by")[0]
                            artist = processed_line.split("by ")[1].split(" are being searched...")[0]
                        self.info(processed_line)

            if stderr_content is not None:
                stderr_content = stderr_content.strip()
                for line in stderr_content.splitlines():
                    processed_line = process_message(line)
                    self.error(processed_line)

    def getSeverity(self) -> SeverityLevel:
        """ Returns the severity level of the logger
        :return: [SeverityLevel] The severity level of the logger
        """
        return SeverityLevel(self.__level)

    def __init__(self, level: int, log_file: Optional[str] = None) -> None:
        """ Initializes the logger
        :param level: [logging__levels] The logger will only log with that severity or higher (default: logging.INFO)
        :param log_file: [string?] The path of the file to write logs to (default: None --- standard output)
        """
        logging.basicConfig(filename=log_file, encoding="utf-8")
        super().__init__(__name__, level if level is not None else logging.INFO)

        self.__level = level
        formatter = CustomFormatter("[%(asctime)s | %(levelname)s] %(message)s")
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        self.addHandler(handler)

def getFormattedMessage(severity: SeverityLevel, msg: str) -> str:
    """ Formats a message to log
    :param severity: [SeverityLevel] The severity of the message, used as a prefix (default: None)
    :param msg: [string] The core message to log
    :return: [string] The formatted message
    """
    prefix = ""
    now: str = getNowEpoch()
    try:
        prefix = SeverityPrefix[severity.name]
    except KeyError:
        print(f"[{now},000 | {SeverityPrefix.CRITICAL}] Invalid severity level: {severity}")
        sys.exit(1)
    return f"[{now},000 | {prefix}] {msg}"

def exitInvalidSeverityLevel(severity: str) -> None:
    """ Prints an error message for an invalid severity level and exits the program
    :param severity: [string] The invalid severity level
    """
    print(getFormattedMessage(SeverityLevel.CRITICAL, f"Invalid severity level: '{severity}'"))
    print(getFormattedMessage(SeverityLevel.INFO, "Available severity levels:"))
    for level in SeverityLevel:
        print(getFormattedMessage(SeverityLevel.INFO, f"  - {level.name}"))
    sys.exit(1)
def getSeverityArg(args: list[str]) -> int:
    """ Gets the severity level from dotenv, otherwise from the command line arguments
    :param args: [list] The command line arguments
    :return: [logging.level] The severity level (default: logging.INFO)
    """
    if dotenv_level is not None:
        if dotenv_level.upper() not in SeverityLevel.__members__:
            exitInvalidSeverityLevel(dotenv_level)
        print(getFormattedMessage(SeverityLevel.INFO, f"  Severity level to {SeverityLevel[dotenv_level].name} according to .env file"))
        return SeverityLevel[dotenv_level]

    level: int = logging.NOTSET
    if len(args) > 1:
        logging_levels: dict[str, int] = logging.getLevelNamesMapping()
        selected_level: str = args[1].upper()
        if selected_level not in logging_levels:
            exitInvalidSeverityLevel(selected_level)
        level = logging_levels[selected_level]
        print(getFormattedMessage(SeverityLevel.INFO, f"  Severity level manually set to {SeverityLevel[level].name}"))
    return level

print(getFormattedMessage(SeverityLevel.DEBUG, "Trying to initialize logger variable..."))
log = Logger(level=getSeverityArg(sys.argv))
log.info(f"Logger initialized with level {log.getSeverity().name}.")