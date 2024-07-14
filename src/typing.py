from flask import Response

from dataclasses import dataclass
from typing import Any, Optional, TypeAlias

############ BROWSER ############

Context: TypeAlias = dict[str, Any]

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

JsonDict: TypeAlias = dict[str, Optional[str | int]]
