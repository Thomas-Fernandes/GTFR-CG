from contextlib import contextmanager
from enum import IntEnum, StrEnum
from io import StringIO
from re import Match
import sys # The whole module must be imported for output redirection to work
from typing import Iterator, Optional, Self

from server.src.constants.dotenv import LOGGER_SEVERITY
from server.src.constants.regex import LYRICSGENIUS_PATTERNS
from server.src.utils.time_utils import getNowEpoch

class LogSeverity(IntEnum):
    """ Enum for severity levels """
    TIME     = 000
    DEBUG    = 100
    INFO     = 200
    LOG      = 201
    WARN     = 300
    ERROR    = 400
    CRITICAL = 500

class SeverityPrefix(StrEnum):
    """ Enum for severity prefixes """
    TIME     = "TIME:"
    DEBUG    = "DEBUG"
    INFO     = "INFO."
    LOG      = "LOG.."
    WARN     = "WARN?"
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

class Logger:
    """ Logger class to log messages

    Attributes:
        __severity: [LogSeverity] The severity level of the logger
        __log_file: [string] The path of the file to write logs to
    """
    def critical(self, msg: str) -> Self: return self.send(msg, LogSeverity.CRITICAL)
    def error(self,    msg: str) -> Self: return self.send(msg, LogSeverity.ERROR)
    def warn(self,     msg: str) -> Self: return self.send(msg, LogSeverity.WARN)
    def log(self,      msg: str) -> Self: return self.send(msg, LogSeverity.LOG)
    def info(self,     msg: str) -> Self: return self.send(msg, LogSeverity.INFO)
    def debug(self,    msg: str) -> Self: return self.send(msg, LogSeverity.DEBUG)

    def time(self, sev: LogSeverity, duration: float, *, padding: int = 0) -> Self:
        """ Logs a message with a timestamp
        :param start: [float] The start time
        :param end: [float] The end time
        :return: [Logger] The logger instance (for chaining)
        """
        if padding < 0: raise ValueError("Padding must be a non-negative integer.")

        if sev < self.__severity: return self

        if duration < 1:
            if duration * 1_000 < 1:
                display_duration = f"{round(duration * 1_000_000)} µ-seconds"
            else:
                display_duration = f"{round(duration * 1_000)} m-seconds"
        else: display_duration = f"{round(duration, 2)} seconds"
        return self.send(f"{' ' * padding}^ took {display_duration}", LogSeverity.TIME)

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
        return self.__severity

    def __init__(
        self,
        severity: LogSeverity = LogSeverity.INFO,
        log_file: Optional[str] = None
    ) -> None:
        """ Initializes the logger
        :param severity: [LogSeverity?] The logger will only log with that severity or higher (default: LogSeverity__INFO)
        :param log_file: [string?] The path of the file to write logs to (default: None --- standard output)
        """
        self.__severity = severity
        self.__log_file = log_file

def exitInvalidSeverityLevel(severity: str) -> None:
    """ Prints an error message for an invalid severity level and exits the program
    :param severity: [string] The invalid severity level
    """
    print(getFormattedMessage(f"Invalid severity level: '{severity}'", LogSeverity.CRITICAL))
    print(getFormattedMessage("Available severity levels:", LogSeverity.INFO))
    for level in LogSeverity:
        print(getFormattedMessage(f"\t- {level.name}", LogSeverity.INFO))
    sys.exit(1)
def getSeverityArg(args: list[str]) -> LogSeverity:
    """ Gets the severity level from dotenv, otherwise from the command line arguments
    :param args: [list] The command line arguments
    :return: [LogSeverity] The severity level (default: LogSeverity__LOG)
    """
    if LOGGER_SEVERITY is not None:
        if LOGGER_SEVERITY.upper() not in LogSeverity.__members__:
            exitInvalidSeverityLevel(LOGGER_SEVERITY)
        print(getFormattedMessage(f"  Severity level to {LogSeverity.__members__[LOGGER_SEVERITY].name} according to .env file", LogSeverity.INFO))
        return LogSeverity[LOGGER_SEVERITY]

    severity: LogSeverity = LogSeverity.LOG
    if len(args) > 1:
        if args[1].upper() not in LogSeverity.__members__:
            exitInvalidSeverityLevel(args[1])
        severity = LogSeverity[args[1].upper()]
        print(getFormattedMessage(f"  Severity level manually set to {severity.name}", LogSeverity.INFO))
    return severity

print(getFormattedMessage("Trying to initialize logger variable...", LogSeverity.DEBUG))
log = Logger(severity=getSeverityArg(sys.argv))
log.log(f"Logger initialized with level {log.getSeverity().name}.")
