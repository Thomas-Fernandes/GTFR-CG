# Installed libraries
from flask import session
from PIL import Image, ImageFilter, ImageDraw
from requests import get as restGet
from bs4 import BeautifulSoup

# Python standard libraries
from os import path

# Local modules
from src.logger import Logger
import src.constants as constants

log = Logger()

def generateCoverArt(input_path: str, output_path: str) -> None:
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

def search_song(song_title, artist_name):
    search_url = constants.BASE_URL + '/search'
    data = {'q': f'{song_title} {artist_name}'}
    response = restGet(search_url, headers=constants.HEADERS, params=data)
    return response.json()

def get_lyrics(song_id):
    song_url = constants.BASE_URL + f'/songs/{song_id}'
    response = restGet(song_url, headers=constants.HEADERS)
    song_info = response.json()
    path = song_info['response']['song']['path']

    page_url = 'https://genius.com' + path
    page = restGet(page_url)
    soup = BeautifulSoup(page.text, 'html.parser')

    lyrics_div = soup.find('div', class_='lyrics')
    if (not lyrics_div):
        lyrics_div = soup.find('div', {'data-lyrics-container': 'true'})

    if (lyrics_div):
        lyrics = lyrics_div.get_text(separator="\n")
    else:
        lyrics_divs = soup.find_all('div', class_='Lyrics__Container-sc-1ynbvzw-6')
        if (lyrics_divs):
            lyrics = "\n".join([div.get_text(separator="\n") for div in lyrics_divs])
        else:
            return 'Paroles non trouvées.'

    formatted_lyrics = format_lyrics(lyrics)
    return formatted_lyrics

def format_lyrics(lyrics):
    lines = lyrics.split('\n')
    formatted_lines = []
    for i, line in enumerate(lines):
        if (line.startswith('[') and line.endswith(']') and i != 0):
            formatted_lines.append('')
        formatted_lines.append(line)
    return '\n'.join(formatted_lines)
