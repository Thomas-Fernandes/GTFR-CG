from contextlib import contextmanager
from enum import Enum
from io import StringIO
from re import Match
import sys # On doit importer tout le module sinon ça ne marche pas
from typing import Iterator, Optional

import src.constants as const
from src.soft_utils import getNowEpoch

class LoggingLevel(Enum):
    """ Enum for logging levels, classified by severity.
    """
    DEBUG    = 0x100
    INFO     = 0x200
    LOG      = 0x201
    WARN     = 0x300
    ERROR    = 0x400
    CRITICAL = 0x500

def getDefaultFormattedMessage(message: str) -> str:
    """ Returns the default formatted message.
    :param message: [string] The core message to log.
    :return: [string] The formatted message.
    """
    return f"{getNowEpoch()}] {message}"

class Logger:
    """ Logger class to log messages.

    Attributes:
        __log_file: [string] The path of the file to write logs to.
    """

    @staticmethod
    def getFormattedMessage(message: str, level: Optional[LoggingLevel] = None) -> str:
        """ Formats a message to log.
        :param message: [string] The core message to log.
        :param level: [LoggingLevel?] The level of the message, used as a prefix. (default: None)
        :return: [string] The formatted message.
        """
        match level:
            case LoggingLevel.DEBUG:
                return f"[DEBUG | {getDefaultFormattedMessage(message)}"
            case LoggingLevel.INFO:
                return f"[INFO. | {getDefaultFormattedMessage(message)}"
            case LoggingLevel.LOG:
                return f"[LOG.. | {getDefaultFormattedMessage(message)}"
            case LoggingLevel.WARN:
                return f"[WARN? | {getDefaultFormattedMessage(message)}"
            case LoggingLevel.ERROR:
                return f"[ERR?! | {getDefaultFormattedMessage(message)}"
            case LoggingLevel.CRITICAL:
                return f"[CRIT! | {getDefaultFormattedMessage(message)}"
            case None:
                return f"[{getDefaultFormattedMessage(message)}"
        raise ValueError(f"Invalid logging level ({level})")

    def error(self, message: str) -> None: self.send(message, LoggingLevel.ERROR)
    def warn(self,  message: str) -> None: self.send(message, LoggingLevel.WARN)
    def log(self,   message: str) -> None: self.send(message, LoggingLevel.LOG)
    def info(self,  message: str) -> None: self.send(message, LoggingLevel.INFO)
    def debug(self, message: str) -> None: self.send(message, LoggingLevel.DEBUG)

    @contextmanager
    def redirect_stdout_stderr(self) -> Iterator[tuple[StringIO, StringIO]]:
        """ Redirects stdout and stderr to a StringIO buffer.
        The buffers are then sent to the logger.
        :return: [iterator] A tuple containing the new stdout and stderr buffers.
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
                for (pattern, action) in const.PATTERNS:
                    match: Optional[Match[str]] = pattern.match(line)
                    if match is not None:
                        return action(match)
                return line

            if stdout_content is not None:
                stdout_content = stdout_content.strip()
                for line in stdout_content.splitlines():
                    processed_line = process_message(line)
                    if processed_line == "Done.":
                        self.log("Lyrics were successfully found and populated.")
                    else:
                        self.info(processed_line)

            if stderr_content is not None:
                stderr_content = stderr_content.strip()
                for line in stderr_content.splitlines():
                    processed_line = process_message(line)
                    self.error(processed_line)

    def send(self, message: str, level: Optional[LoggingLevel] = None) -> None:
        """ Sends a message to log.
        :param message: [string] The message to log.
        :param level: [LoggingLevel?] The level of the message. (default: None)
        """
        message_to_log = self.getFormattedMessage(message, level)
        if self.__log_file is not None and self.__log_file.strip() != "":
            with open(self.__log_file, 'a') as file:
                file.write(message_to_log + '\n')
        else:
            print(message_to_log)

    def __init__(self, log_file: Optional[str] = None) -> None:
        """ Initializes the logger.
        :param log_file: [string?] The path of the file to write logs to. (default: None --- standard output)
        """
        self.__log_file = log_file

log = Logger()