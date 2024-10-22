from collections.abc import Callable
from time import sleep
from typing import Any, Optional

def retry(*, condition: Optional[Callable[[Any], bool]] = None, times: int = 1, back_off: float = 0) -> Callable[..., Any]:
    """ Decorator to retry a function until a condition is met.
    :param condition: [callable] A lambda expression for the boolean condition to meet. (default: None)
    :param times: [int] The number of times to retry. (default: 1)
    :param back_off: [float] The time to wait between retries, in seconds. (default: 0)
    """
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        if not callable(func):
            raise ValueError("The first argument must be a callable object")
        if condition is not None and not callable(condition):
            raise ValueError("The condition must be a callable object")
        if back_off < 0:
            raise ValueError("Back-off time must be a non-negative number")
        if times < 1:
            raise ValueError("Number of times must be a positive integer")

        def wrapper(*args: tuple[Any], **kwargs: dict[str, Any]) -> Any:
            rv = None
            thrown = None
            for _ in range(times):
                rv = None # reset the return value
                thrown = None # reset the thrown exception
                try:
                    rv = func(*args, **kwargs)
                except Exception as e:
                    thrown = e
                if thrown is None and (condition is None or condition(rv) == True):
                    return rv
                sleep(back_off)
            if thrown is not None:
                raise thrown
            return rv
        return wrapper
    return decorator
