from collections.abc import Callable
from time import sleep
from typing import Any, Optional

def retry(*, condition: Optional[Callable[[Any], bool]] = None, times: int = 1, back_off: float = 0) -> Callable[..., Any]:
    """ Decorator to retry a function until a condition is met
    :param condition: [callable] A lambda expression of a boolean condition for the method call to meet (default: None)
    :param times: [int] The number of times to retry (default: 1)
    :param back_off: [float] The time to wait between retries, in m-seconds; grows exponentially (default: 0)
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

        def wrapper(*args: tuple[Any], **kwargs: dict[str, Any]) -> Any: # screw you, SonarLint
            rv = None
            thrown = None
            for n in range(times):
                rv = None # reset the return value
                thrown = None # reset the thrown exception
                try:
                    rv = func(*args, **kwargs) # run the function
                except Exception as e:
                    thrown = e # catch the exception to examine it later
                if thrown is None and (condition is None or condition(rv) == True):
                    return rv # if condition is met, return the rv of the first successful run
                to_wait = back_off * 2 ** n # make back-off grow exponentially
                sleep(to_wait / 1000)
            if thrown is not None: # if method kept throwing, raise the last exception
                raise thrown
            return rv
        return wrapper
    return decorator
