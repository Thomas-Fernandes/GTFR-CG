from collections.abc import Callable
from time import sleep
from typing import Any, Optional

def retry(*, condition: Optional[Callable[[Any], bool]] = None, times: int = 1, back_off: float = 0) -> Callable[..., Any]:
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
            for _ in range(times):
                rv = func(*args, **kwargs)
                if condition is None or condition(rv):
                    return rv
                sleep(back_off)
            return rv
        return wrapper
    return decorator
