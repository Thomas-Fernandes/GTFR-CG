from numpy import array as NpArray
from PIL import Image

from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

from src.constants.image_generation import ImageMode
from src.typing_gtfr import RGBAColor, RGBColor


def convertHexToRgba(hex_color: str) -> RGBAColor:
    """Converts a hex color to an RGBA tuple
    :param hex_color: [string] The hex color to convert
    :return: [RGBAColor] The RGBA tuple
    """
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return r, g, b, 255


with redirect_stdout(StringIO()), redirect_stderr(StringIO()):  # make it silent, removing the longdouble warning
    from sklearn.cluster import KMeans


def getDominantColor(image_path: str, n_clusters: int = 4, random_state: int = 777) -> str:  # TRUST THE 777
    """Gets the dominant color of an image, using the K-means algorithm
    :param image_path: [string] The path to the image
    :return: [str] The dominant color
    """
    try:
        with Image.open(image_path) as img:
            img = img.convert(ImageMode.RGB)
    except Exception as e:
        print(f"Error while opening image: {e}")
        return "000000"

    pixels: list[RGBColor] = list(img.getdata())
    n_clusters = max(1, min(n_clusters, 16)) # 1 <= clusters <= 16

    print("  Deducing dominant color from background image via k-means...")
    kMeans = KMeans(n_clusters=n_clusters, random_state=random_state)
    kMeans.fit(NpArray(pixels))
    dominant_colors = kMeans.cluster_centers_.astype(int)
    dominant_colors = [f"{r:02x}{g:02x}{b:02x}" for r, g, b in dominant_colors]

    print(f"    {min(3, len(dominant_colors))} dominant colors: {dominant_colors[:3]}")
    print(f"    Deduced dominant color: {dominant_colors[0]}")
    print("  Dominant color deduced successfully.")
    return dominant_colors[0]


def getAverageColor(image_path: str) -> str:  # initially used for the background color of the generated cards
    """Gets the average color of an image
    :param image_path: [string] The path to the image
    :return: [string] The hex color of the average color
    """
    try:
        with Image.open(image_path) as img:
            img = img.convert(ImageMode.RGB)
    except Exception as e:
        # log.error(f"Error while opening image: {e}") # causes circular import on log
        print(f"Error while opening image: {e}")
        return "000000"

    pixels: list[RGBColor] = list(img.getdata())
    total_r, total_g, total_b = 0, 0, 0
    for r, g, b in pixels:
        total_r += r
        total_g += g
        total_b += b

    num_pixels = len(pixels)
    avg_r = total_r // num_pixels
    avg_g = total_g // num_pixels
    avg_b = total_b // num_pixels
    avg_hex = f"{avg_r:02x}{avg_g:02x}{avg_b:02x}"
    return avg_hex


def getNormalizedFilename(name: str) -> str:  # initially used for the filename of the generated cards
    """Formats the name of the song for the filename
    :param name: [string] The name of the song
    :return: [string] The formatted name of the song
    """
    return "".join(
        [c for c in name.replace(" ", "_") if c.isalnum() or c == "_"]
    )  # replace spaces with underscores, remove any non-alphanum char
