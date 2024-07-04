from enum import Enum

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
