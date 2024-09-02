from dataclasses import dataclass
from typing import Literal, Optional, TypeAlias

############ BROWSER ############

@dataclass
class Route:
    """ Dataclass to store a route's information.

    Attributes:
        path: [string] The path of the route.
        bp_name: [string?] The name of the blueprint. (default: None)
    """
    path: str
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
    cards_gen: Route

    def __repr__(self) -> str:
        """ Returns the Routes dataclass as a string
        :return: [string] The dataclass' content, as a string.
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            content += f"{key}={value}, "
        return f"Routes({content[:-2]})"

############ SOFTWARE ############

CachedElemType: TypeAlias = Literal[
    "sessions",
    "images",
    "cards",
]
@dataclass(kw_only=True)
class Cache:
    """ Dataclass to store cache information.

    Attributes:
        sessions: [string] The name of the Flask sessions directory.
        images: [string] The name of the images directory.
        cards: [string] The name of the cards directory.
    """
    sessions: str
    images: str
    cards: str

    def __repr__(self) -> str:
        """ Returns the Cache dataclass as a string
        :return: [string] The dataclass' content, as a string.
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            content += f"{key}={value}, "
        return f"Cache({content[:-2]})"

JsonDict: TypeAlias = dict[str, Optional[str | int]]
