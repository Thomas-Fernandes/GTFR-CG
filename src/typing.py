from flask import Response

from dataclasses import dataclass
from typing import Any, Optional, TypeAlias

############ BROWSER ############

Context: TypeAlias = dict[str, Any]

@dataclass
class Route:
    """ Dataclass to store a route's information.

    Attributes:
        path: [string] The path of the route.
        view_filename: [string?] The filename of the view to render. (default: None)
        bp_name: [string?] The name of the blueprint. (default: None)
    """
    path: str
    view_filename: Optional[str] = None
    bp_name: Optional[str] = None

    def __repr__(self) -> str:
        """ Returns the Route dataclass as a string
        :return: [string] The dataclass' content, as a string.
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            if value is not None:
                content += f"{key}={value}, "
        return f"Route({content[:-2]})"

@dataclass
class Routes:
    """ Dataclass to store the application's routes.

    Attributes:
        root: [Route] The root route.
        redirect: [Route] The redirect route.
        home: [Route] The home route.
        art_gen: [Route] The artwork generation route.
        proc_img: [Route] The processed images route.
        lyrics: [Route] The lyrics route.
    """
    root: Route
    redirect: Route
    home: Route
    art_gen: Route
    proc_img: Route
    lyrics: Route

    def __repr__(self) -> str:
        """ Returns the Routes dataclass as a string
        :return: [string] The dataclass' content, as a string.
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            content += f"{key}={value}, "
        return f"Routes({content[:-2]})"

JsonResponse: TypeAlias = tuple[Response, int]
RenderView: TypeAlias = str

############ SOFTWARE ############

JsonDict: TypeAlias = dict[str, Optional[str | int]]
