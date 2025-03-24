from PIL import Image

from dataclasses import dataclass
from typing import Literal, Optional, TypeAlias

from src.constants.enums import PayloadFields

############ BROWSER ############


@dataclass
class Route:
    """Dataclass to store a route's information

    Attributes:
        path: [string] The path of the route
        bp_name: [string?] The name of the blueprint (default: None)
    """

    path: str
    bp_name: Optional[str] = None

    def __repr__(self) -> str:
        """Returns the Route dataclass as a string
        :return: [string] The dataclass' content, as a string
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            if value is not None:
                content += f"{key}={value}, "
        return f"Route({content[:-2]})"


@dataclass
class Routes:
    """Dataclass to store the application's routes

    Attributes:
        root: [Route] The root route
        redirect: [Route] The redirect route
        home: [Route] The home route
        art_proc: [Route] The artwork generation route
        proc_art: [Route] The artwork processing route
        lyrics: [Route] The lyrics route
    """

    root: Route
    redirect: Route
    home: Route
    art_gen: Route
    art_proc: Route
    lyrics: Route
    cards_gen: Route

    def __repr__(self) -> str:
        """Returns the Routes dataclass as a string
        :return: [string] The dataclass' content, as a string
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            content += f"{key}={value}, "
        return f"Routes({content[:-2]})"


############ SOFTWARE ############

SongMetadata: TypeAlias = dict[str, str]
RGBAColor: TypeAlias = tuple[int, int, int, int]
RGBColor: TypeAlias = tuple[int, int, int]


@dataclass
class CardMetadata:
    """Dataclass to store the card's metadata

    Attributes:
        card_metaname: [string] The author and title of the song
        include_bg_img: [bool] Whether to include the background image
        bg: [Image.Image] The background image of the card
        bottom_bar_overlay: [Image.Image] The bottom bar overlay of the card
        dominant_color: [RGBColor] The average color of the background image
        text_lyrics_color: [RGBColor] The background color for the text of the card
        text_meta_color: [RGBColor] The text color of the metadata of the card
    """

    card_metaname: str
    include_bg_img: bool
    bg: Image.Image
    bottom_bar_overlay: Image.Image
    dominant_color: RGBColor
    text_lyrics_color: RGBColor
    text_meta_color: RGBColor

    def __repr__(self) -> str:
        """Returns the CardMetadata dataclass as a string
        :return: [string] The dataclass' content, as a string
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            if value is not None:
                if key == "bg" or key == "bottom_bar_overlay":
                    continue
                if isinstance(value, str):
                    content += f"{key}='{value}', "
                else:
                    content += f"{key}={value}, "
        return f"CardMetadata({content[:-2]})"


CardgenSettings: TypeAlias = dict[PayloadFields, bool | str]

CardsContents: TypeAlias = list[list[str]]

CachedElemType: TypeAlias = Literal[
    "sessions",
    "images",
    "cards",
]


@dataclass(kw_only=True)
class Cache:
    """Dataclass to store cache information

    Attributes:
        sessions: [string] The name of the Flask sessions directory
        images: [string] The name of the images directory
        cards: [string] The name of the cards directory
    """

    sessions: str
    images: str
    cards: str

    def __repr__(self) -> str:
        """Returns the Cache dataclass as a string
        :return: [string] The dataclass' content, as a string
        """
        content: str = ""
        for (key, value) in self.__dict__.items():
            content += f"{key}={value}, "
        return f"Cache({content[:-2]})"


JsonDict: TypeAlias = dict[str, Optional[str | int]]

L10nDict: TypeAlias = dict[str, dict[str, str]]