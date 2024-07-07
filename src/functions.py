# Installed libraries
from flask import session
from lyricsgenius import Genius
from PIL import Image, ImageFilter, ImageDraw

# Python standard libraries
from os import path
from re import sub, split, match
from typing import Optional

# Local modules
from src.logger import log
from src.statistics import updateStats
import src.constants as constants

genius = Genius(constants.GENIUS_API_TOKEN)

def generateCoverArt(input_path: str, output_path: str, include_center_artwork: bool = True) -> None:
    log.info(f"Generating cover art... (session {input_path.split(constants.SLASH)[-2].split('-')[0]}-...)")

    image: Image.Image = Image.open(input_path)

    # Redimensionner l'image à 1920 de large tout en conservant les proportions
    base_width = 1920
    w_percent = (base_width / float(image.size[0]))
    h_size = int((float(image.size[1]) * float(w_percent)))
    resized_image: Image.Image = image.resize((base_width, h_size), Image.Resampling.LANCZOS)

    # Recadrer l'image pour obtenir 1080 de hauteur (crop le reste)
    top = (h_size - 1080) // 2
    bottom = (h_size + 1080) // 2
    cropBox = (0, top, 1920, bottom)
    cropped_image = resized_image.crop(cropBox)

    if (include_center_artwork == False):
        final_blurred_image = cropped_image
    else:
        # flou gaussien sur l'image recadrée avec masque radial
        blurred_image: Image.Image = cropped_image.filter(ImageFilter.GaussianBlur(radius=25))

        mask = Image.new("L", cropped_image.size, "black")
        draw: ImageDraw.ImageDraw = ImageDraw.Draw(mask)
        max_dim = min(cropped_image.size) / 2
        center_x, center_y = cropped_image.size[0] // 2, cropped_image.size[1] // 2

        for i in range(int(max_dim)):
            opacity = 255 - int((255 * i) / max_dim)
            coords = [
                center_x - i,
                center_y - i,
                center_x + i,
                center_y + i
            ]
            draw.ellipse(coords, fill=opacity)

        final_blurred_image = Image.composite(cropped_image, blurred_image, mask)

        center_image: Image.Image = image.resize((800, 800), Image.Resampling.LANCZOS)
        (top_left_x, top_left_y) = (center_x - 400, center_y - 400)
        final_blurred_image.paste(center_image, (top_left_x, top_left_y))

    final_blurred_image.save(output_path)

def generateThumbnail(bg_path: str, output_folder: str) -> None:
    log.info(f"Generating thumbnails... (session {bg_path.split(constants.SLASH)[-2].split('-')[0]}-...)")

    for position in constants.LOGO_POSITIONS:
        logo_path = f'{position}.png'
        background = Image.open(bg_path)
        user_folder = path.abspath(str(session['user_folder']))
        user_folder = constants.SLASH.join(user_folder.split(constants.SLASH)[:-1])
        overlay_file = f"{user_folder}{constants.SLASH}{constants.THUMBNAIL_DIR}{logo_path}"
        if (not path.exists(overlay_file)):
            log.warn(f"Overlay file not found: {overlay_file}")
            continue
        overlay = Image.open(overlay_file)

        new_background = Image.new('RGBA', background.size)
        new_background.paste(background, (0, 0))
        new_background.paste(overlay, mask=overlay)

        final_image = new_background.convert('RGB')
        output_path = path.join(output_folder, f'thumbnail_{position}.png')
        final_image.save(output_path)

def getLyrics(song_title: str, artist_name: str) -> str:
    song: Optional[Genius.Song] = None
    with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
        song = genius.search_song(song_title, artist_name)

    if (song is None):
        return 'Lyrics not found.'

    lyrics = song.lyrics

    # Removing charabia at the beginning and end of the lyrics
    lyrics = sub(r'^.*Lyrics\[', '[', lyrics).strip()
    lyrics = sub(r'\d+Embed$', '', lyrics).strip()

    # Ensure double newline before song parts
    def add_newline_before_song_parts(lyrics: str) -> str:
        song_parts = split(r'<[^>]+>', lyrics)
        new_lyrics = []
        for (i, part) in enumerate(song_parts):
            if (match(r'"[^"]*"', part)):
                if (i == 0 or song_parts[i-1].endswith('\n\n') or song_parts[i-1].strip() == ""):
                    new_lyrics.append(part)
                else:
                    new_lyrics.append('\n\n' + part)
            else:
                new_lyrics.append(part)
        return ''.join(new_lyrics)

    lyrics = add_newline_before_song_parts(lyrics)
    updateStats(to_increment='lyricsFetches')

    return lyrics
