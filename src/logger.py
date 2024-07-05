from contextlib import contextmanager
from enum import Enum
from io import StringIO
import sys # For redirect_stdout_stderr
from typing import Iterator

from src.soft_utils import getNowEpoch

class LoggingLevel(Enum):
    DEBUG    = 0x100
    INFO     = 0x101
    LOG      = 0x200
    WARN     = 0x301
    ERROR    = 0x302
    CRITICAL = 0x303

def getDefaultFormattedMessage(message: str) -> str:
    return f"{getNowEpoch()}] {message}"

class Logger:
    @staticmethod
    def getFormattedMessage(message: str, level: LoggingLevel | None = None) -> str:
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

    def error(self, message: str) -> None:
        self.send(message, LoggingLevel.ERROR)
    def warn(self, message: str) -> None:
        self.send(message, LoggingLevel.WARN)
    def log(self, message: str) -> None:
        self.send(message, LoggingLevel.LOG)
    def info(self, message: str) -> None:
        self.send(message, LoggingLevel.INFO)
    def debug(self, message: str) -> None:
        self.send(message, LoggingLevel.DEBUG)

    @contextmanager
    def redirect_stdout_stderr(self) -> Iterator[tuple[StringIO, StringIO]]:
        new_stdout, new_stderr = StringIO(), StringIO()
        old_stdout, old_stderr = sys.stdout, sys.stderr
        sys.stdout, sys.stderr = new_stdout, new_stderr
        try:
            yield new_stdout, new_stderr
        finally:
            sys.stdout, sys.stderr = old_stdout, old_stderr
            new_stdout.seek(0)
            new_stderr.seek(0)
            stdout_content = new_stdout.read().strip()
            stderr_content = new_stderr.read().strip()
            if (stdout_content is not None):
                for line in stdout_content.splitlines():
                    self.info(line)
            if (stderr_content is not None):
                for line in stderr_content.splitlines():
                    self.error(line)

    def send(self, message: str, level: LoggingLevel | None = None) -> None:
        message_to_log = self.getFormattedMessage(message, level)
        if (self.__log_file):
            with open(self.__log_file, 'a') as file:
                file.write(message_to_log + '\n')
        else:
            print(message_to_log)

    def __init__(self, log_file: str | None = None) -> None:
        # Logger objects will print to console if log_file is None
        self.__log_file = log_file
