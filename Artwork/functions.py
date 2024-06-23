
from flask import session
from PIL import Image, ImageFilter, ImageDraw
from os import path, name as osName

SLASH = '/' if (osName != 'nt') else '\\'
MINIA_FOLDER = 'Artwork' + SLASH + 'Miniatures'

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
        draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], fill=opacity)

    final_blurred_image = Image.composite(cropped_image, blurred_image, mask)

    center_image: Image.Image = image.resize((800, 800), Image.Resampling.LANCZOS)
    top_left_x = center_x - 400
    top_left_y = center_y - 400
    final_blurred_image.paste(center_image, (top_left_x, top_left_y))

    final_blurred_image.save(output_path)

def generateMinia(bg_path: str, logo_path: str, output_path: str) -> None:
    background: Image.Image = Image.open(bg_path)
    user_folder: str = path.abspath(str(session['user_folder']))
    user_folder = SLASH.join(user_folder.split(SLASH)[:-2]) # Remove the last folder and PID
    overlay_file = f"{user_folder}{SLASH}{MINIA_FOLDER}{SLASH}minia_{logo_path}.png"
    overlay: Image.Image = Image.open(overlay_file)

    new_background: Image.Image = Image.new('RGBA', background.size)
    new_background.paste(background, (0, 0))
    new_background.paste(overlay, mask=overlay)

    final_image = new_background.convert('RGB')
    final_image.save(output_path)