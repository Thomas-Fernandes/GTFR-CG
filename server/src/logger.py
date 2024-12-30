from contextlib import contextmanager
from enum import IntEnum, StrEnum
from io import StringIO
import logging; logging.levels: dict[str, int] = logging.getLevelNamesMapping()
from re import Match
import sys # The whole module must be imported for output redirection to work
from typing import Iterator, Optional, Self

from server.src.constants.dotenv import LOGGER_SEVERITY
from server.src.constants.regex import LYRICSGENIUS_PATTERNS
from server.src.utils.time_utils import getNowEpoch

class LogSeverity(IntEnum):
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

def getFormattedMessage(msg: str, severity: Optional[LogSeverity] = None) -> str:
    """ Formats a message to log
    :param msg: [string] The core message to log
    :param severity: [LogSeverity?] The severity of the message, used as a prefix (default: None)
    :return: [string] The formatted message
    """
    prefix: str
    now: str = getNowEpoch()
    try:
        prefix = SeverityPrefix["" if (severity is None) else severity.name]
    except KeyError:
        print(f"[{SeverityPrefix.CRITICAL} | {now}] Invalid severity level: {severity}")
        sys.exit(1)
    return f"[{prefix} | {now}] {msg}"

class Logger(logging.getLoggerClass()):
    """ Logger class to log messages

    Attributes:
        __severity: [LogSeverity] The severity level of the logger
        __log_file: [string] The path of the file to write logs to
    """
    def critical(self, msg: str) -> Self: super().log(logging.CRITICAL, "%s", msg); return self
    def error(self,    msg: str) -> Self: super().log(logging.ERROR, "%s", msg);    return self
    def warn(self,     msg: str) -> Self: super().log(logging.WARNING, "%s", msg);  return self
    def info(self,     msg: str) -> Self: super().log(logging.INFO, "%s", msg);     return self
    def debug(self,    msg: str) -> Self: super().log(logging.DEBUG, f"[{SeverityPrefix(logging.DEBUG.name)} | %(asctime)s] %(message)s", msg);    return self

    def time(self, sev: LogSeverity, duration: float, *, padding: int = 0) -> Self:
        """ Logs a message with a timestamp
        :param start: [float] The start time
        :param end: [float] The end time
        :return: [Logger] The logger instance (for chaining)
        """
        if padding < 0: raise ValueError("Padding must be a non-negative integer.")

        if sev >= self.__severity:
            if duration < 1:
                if duration * 1_000 < 1:
                    display_duration = f"{round(duration * 1_000_000)} µ-seconds"
                else:
                    display_duration = f"{round(duration * 1_000)} m-seconds"
            else: display_duration = f"{round(duration, 2)} seconds"
            super().log(LogSeverity.INFO, "%s", f"{' ' * padding}^ took {display_duration}")
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

    def send(self, msg: str, severity: LogSeverity) -> Self:
        """ Sends a message to log
        :param msg: [string] The message to log
        :param severity: [LogSeverity?] The severity of the message
        :return: [Logger] The logger instance (for chaining)
        """
        if severity != LogSeverity.TIME and severity < self.__severity: return self
        message_to_log = getFormattedMessage(msg, severity)
        if self.__log_file is not None and self.__log_file.strip() != "":
            if self.__severity <= LogSeverity.DEBUG:
                print(f"Writing to log file: {self.__log_file}")
            with open(self.__log_file, "a") as file:
                file.write(message_to_log + '\n')
        else:
            print(message_to_log)
        return self

    def getSeverity(self) -> LogSeverity:
        """ Returns the severity level of the logger
        :return: [LogSeverity] The severity level of the logger
        """
        return LogSeverity(self.__severity)

    def __init__(
        self,
        severity: int = logging.INFO,
        log_file: Optional[str] = None
    ) -> None:
        """ Initializes the logger
        :param severity: [logging__levels?] The logger will only log with that severity or higher (default: logging.INFO)
        :param log_file: [string?] The path of the file to write logs to (default: None --- standard output)
        """
        super().__init__(__name__, LogSeverity(severity).name)
        self.__severity = severity
        self.__log_file = log_file
        # logging.basicConfig(format=f"[{SeverityPrefix[LogSeverity(severity).name].value} | %(asctime)s] %(message)s", encoding="utf-8")

def exitInvalidSeverityLevel(severity: str) -> None:
    """ Prints an error message for an invalid severity level and exits the program
    :param severity: [string] The invalid severity level
    """
    print(getFormattedMessage(f"Invalid severity level: '{severity}'", LogSeverity.CRITICAL))
    print(getFormattedMessage("Available severity levels:", LogSeverity.INFO))
    for level in LogSeverity:
        print(getFormattedMessage(f"\t- {level.name}", LogSeverity.INFO))
    sys.exit(1)
def getSeverityArg(args: list[str]) -> int:
    """ Gets the severity level from dotenv, otherwise from the command line arguments
    :param args: [list] The command line arguments
    :return: [logging.level] The severity level (default: logging.INFO)
    """
    if LOGGER_SEVERITY is not None:
        if LOGGER_SEVERITY.upper() not in LogSeverity.__members__:
            exitInvalidSeverityLevel(LOGGER_SEVERITY)
        print(getFormattedMessage(f"  Severity level to {LogSeverity[LOGGER_SEVERITY].name} according to .env file", LogSeverity.INFO))
        return LogSeverity[LOGGER_SEVERITY]

    level = LogSeverity.DEBUG
    if len(args) > 1:
        selected_level: str = args[1].upper()
        if selected_level not in logging.levels:
            exitInvalidSeverityLevel(selected_level)
        level: int = logging.levels[selected_level]
        print(getFormattedMessage(f"  Severity level manually set to {LogSeverity(level).name}", LogSeverity.INFO))
    return level

print(getFormattedMessage("Trying to initialize logger variable...", LogSeverity.DEBUG))
log = Logger(severity=getSeverityArg(sys.argv))
log.info(f"Logger initialized with level {log.getSeverity().name}.")