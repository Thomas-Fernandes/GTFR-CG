from contextlib import contextmanager
from enum import Enum
from io import StringIO
from re import Match
import sys # On doit importer tout le module sinon ça ne marche pas
from typing import Iterator, Optional

import src.constants as const
from src.soft_utils import getNowEpoch

class LogSeverity(Enum):
    """ Enum for logging severitys, classified by severity.
    """
    DEBUG    = 0x100
    INFO     = 0x200
    LOG      = 0x201
    WARN     = 0x300
    ERROR    = 0x400
    CRITICAL = 0x500

def getPrefix(severity: LogSeverity | None) -> str:
    """ Returns the prefix of a logging severity.
    :param severity: [LogSeverity] The logging severity.
    :return: [string] The prefix of the logging severity.
    """
    match severity:
        case LogSeverity.DEBUG:    return "DEBUG"
        case LogSeverity.INFO:     return "INFO."
        case LogSeverity.LOG:      return "LOG.."
        case LogSeverity.WARN:     return "WARN?"
        case LogSeverity.ERROR:    return "ERR?!"
        case LogSeverity.CRITICAL: return "CRIT!"
        case None:                  return ""
    raise ValueError(f"Invalid logging severity ({severity})")

class Logger:
    """ Logger class to log messages.

    Attributes:
        __log_file: [string] The path of the file to write logs to.
    """

    @staticmethod
    def getFormattedMessage(msg: str, severity: Optional[LogSeverity] = None) -> str:
        """ Formats a message to log.
        :param msg: [string] The core message to log.
        :param severity: [LogSeverity?] The severity of the message, used as a prefix. (default: None)
        :return: [string] The formatted message.
        """
        prefix: str = getPrefix(severity)
        if prefix != "":
            return f"[{prefix} | {getNowEpoch()}] {msg}"
        else:
            return f"[{getNowEpoch()}] {msg}"

    def critical(self, msg: str) -> None: self.send(msg, LogSeverity.CRITICAL)
    def error(self,    msg: str) -> None: self.send(msg, LogSeverity.ERROR)
    def warn(self,     msg: str) -> None: self.send(msg, LogSeverity.WARN)
    def log(self,      msg: str) -> None: self.send(msg, LogSeverity.LOG)
    def info(self,     msg: str) -> None: self.send(msg, LogSeverity.INFO)
    def debug(self,    msg: str) -> None: self.send(msg, LogSeverity.DEBUG)

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

    def send(self, msg: str, severity: LogSeverity = LogSeverity.LOG) -> None:
        """ Sends a message to log.
        :param msg: [string] The message to log.
        :param severity: [LogSeverity?] The severity of the message. (default: None)
        """
        if severity.value < self.__severity.value: return

        message_to_log = self.getFormattedMessage(msg, severity)
        if self.__log_file is not None and self.__log_file.strip() != "":
            with open(self.__log_file, 'a') as file:
                file.write(message_to_log + '\n')
        else:
            print(message_to_log)

    def __init__(
            self,
            severity: LogSeverity = LogSeverity.INFO,
            log_file: Optional[str] = None
    ) -> None:
        """ Initializes the logger.
        :param severity: [LogSeverity?] The logger will only log with that severity or higher. (default: LogSeverity.INFO)
        :param log_file: [string?] The path of the file to write logs to. (default: None --- standard output)
        """
        self.__severity = severity
        self.__log_file = log_file

global log
log = Logger()