from flask import Response

from dataclasses import dataclass
from typing import Optional, TypeAlias

############ BROWSER ############

@dataclass
class Route:
    path: str
    view_filename: Optional[str] = None
    bp_name: Optional[str] = None

    def __repr__(self) -> str:
        content: str = ""
        for (key, value) in self.__dict__.items():
            if value is not None:
                content += f"{key}={value}, "
        return f"Route({content[:-2]})"

@dataclass
class Routes:
    root: Route
    home: Route
    redirect: Route
    art_gen: Route
    proc_img: Route
    lyrics: Route

    def __repr__(self) -> str:
        content: str = ""
        for (key, value) in self.__dict__.items():
            content += f"{key}={value}, "
        return f"Routes({content[:-2]})"

JsonResponse: TypeAlias = tuple[Response, int]
RenderView: TypeAlias = str

############ SOFTWARE ############

DictKeys: TypeAlias = list[str]
JsonDict: TypeAlias = dict[str, Optional[str | int]]

class ContextObj:
    redirect_to: str
    error_text: str
    plural: str

    stats: JsonDict
    plurals: JsonDict
    session_status: str
    genius_token: str

    lyrics: str

    def __init__(self, **kwargs: JsonDict) -> None:
        self.__dict__.update(kwargs)

Context: TypeAlias = dict[str, JsonDict | str]