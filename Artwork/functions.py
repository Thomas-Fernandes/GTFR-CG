
from PIL import Image, ImageFilter, ImageDraw

def jaquette(input, output):
    image = Image.open(input)
    
    # Redimensionner l'image à 1920 de large tout en conservant les proportions
    base_width = 1920
    w_percent = (base_width / float(image.size[0]))
    h_size = int((float(image.size[1]) * float(w_percent)))
    resized_image = image.resize((base_width, h_size), Image.Resampling.LANCZOS)

    # Recadrer l'image pour obtenir 1080 de hauteur (crop le reste)
    top = (h_size - 1080) / 2
    bottom = (h_size + 1080) / 2
    cropped_image = resized_image.crop((0, top, 1920, bottom))

    # flou gaussien sur l'image recadrée avec masque radial
    blurred_image = cropped_image.filter(ImageFilter.GaussianBlur(radius=25))

    mask = Image.new("L", cropped_image.size, "black")
    draw = ImageDraw.Draw(mask)
    max_dim = min(cropped_image.size) / 2
    center_x, center_y = cropped_image.size[0] // 2, cropped_image.size[1] // 2

    for i in range(int(max_dim)):
        opacity = 255 - int((255 * i) / max_dim)
        draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], fill=opacity)

    final_blurred_image = Image.composite(cropped_image, blurred_image, mask)

    center_image = image.resize((800, 800), Image.Resampling.LANCZOS)
    top_left_x = center_x - 400
    top_left_y = center_y - 400
    final_blurred_image.paste(center_image, (top_left_x, top_left_y))

    final_blurred_image.save(output)

def miniature(background, logo, output):
    background = Image.open(background)
    overlay_file = f"Artwork/Miniatures/minia_{logo}.png"
    overlay = Image.open(overlay_file)

    background_width, background_height = background.size
    overlay_width, overlay_height = overlay.size
    position = ((background_width - overlay_width) // 2, (background_height - overlay_height) // 2)

    new_background = Image.new('RGBA', background.size)
    new_background.paste(background, (0, 0))
    new_background.paste(overlay, position, overlay)

    final_image = new_background.convert('RGB')
    final_image.save(output)