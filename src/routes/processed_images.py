from flask import Blueprint, render_template, Response, send_from_directory
from PIL import Image, ImageFilter, ImageDraw

from os import path

import src.constants as const
from src.logger import log
from src.routes.redirect import renderRedirection
from src.statistics import updateStats
from src.typing import Context, JsonResponse, RenderView
from src.web_utils import createJsonResponse

from src.app import app
bp_processed_images = Blueprint(const.ROUTES.proc_img.bp_name, __name__.split('.')[-1])
session = app.config

@staticmethod
def generateCoverArt(input_path: str, output_path: str, include_center_artwork: bool = True) -> None:
    """ Generates the cover art for the given input image and saves it to the output path.
    :param input_path: [string] The path to the input image.
    :param output_path: [string] The path to save the output image.
    :param include_center_artwork: [bool] Whether to include the center artwork in the cover art. (default: True)
    """
    def getSessionFirstName() -> str:
        """ Returns the first segment of the session id.
        :return: [string] The first segment of the session id.
        """
        return input_path.split(const.SLASH)[-2].split('-')[0]
    log.info(f"Generating cover art... (session {getSessionFirstName()}-...)")

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

@staticmethod
def generateThumbnails(bg_path: str, output_folder: str) -> None:
    """ Generates the thumbnails for the given background image and saves them in the output folder.
    :param bg_path: [string] The path to the background image.
    :param output_folder: [string] The path to the folder where the thumbnails will be saved.
    """
    log.info(f"Generating thumbnails... (session {bg_path.split(const.SLASH)[-2].split('-')[0]}-...)")

    for position in const.LOGO_POSITIONS:
        logo_path = f"{position}.png"
        background = Image.open(bg_path)
        user_folder = path.abspath(str(session[const.SessionFields.user_folder.value]))
        user_folder = const.SLASH.join(user_folder.split(const.SLASH)[:-1])
        overlay_file = f"{user_folder}{const.SLASH}{const.THUMBNAIL_DIR}{logo_path}"
        if (not path.exists(overlay_file)):
            log.warn(f"Overlay file not found: {overlay_file}")
            continue
        overlay = Image.open(overlay_file)

        new_background = Image.new("RGBA", background.size)
        new_background.paste(background, (0, 0))
        new_background.paste(overlay, mask=overlay)

        final_image = new_background.convert("RGB")
        output_path = path.join(output_folder, f"thumbnail_{position}.png")
        final_image.save(output_path)

@bp_processed_images.route("/download-image/<filename>", methods=["GET"])
def downloadImage(filename: str) -> Response | JsonResponse:
    """ Downloads the image with the given filename.
    :param filename: [string] The name of the image to download.
    :return: [Response | JsonResponse] The response containing the image, or an error message.
    """
    if const.SessionFields.user_folder.value not in session:
        return createJsonResponse(const.HttpStatus.NOT_FOUND.value, const.ERR_INVALID_SESSION)

    user_folder = str(session[const.SessionFields.user_folder.value])
    directory = path.abspath(path.join(const.PROCESSED_DIR, user_folder))
    return send_from_directory(directory, filename, as_attachment=True)

@bp_processed_images.route("/download-thumbnail/<idx>", methods=["GET"])
def downloadThumbnail(idx: str) -> Response | JsonResponse:
    """ Downloads the thumbnail with the given index.
    :param idx: [string] The index of the thumbnail to download.
    :return: [Response | JsonResponse] The response containing the thumbnail, or an error message.
    """
    idx_img = int(idx.strip())
    if idx_img not in range(1, 10):
        log.error(f"Invalid thumbnail index: {idx_img}")
        return createJsonResponse(const.HttpStatus.NOT_FOUND.value, const.ERR_INVALID_THUMBNAIL)
    filename: str = \
        f"{const.THUMBNAIL_PREFIX}" \
        f"{const.LOGO_POSITIONS[idx_img - 1]}" \
        f"{const.THUMBNAIL_EXT}"
    return downloadImage(filename)

@bp_processed_images.route(const.ROUTES.proc_img.path, methods=["GET"])
def renderProcessedImages() -> RenderView:
    """ Renders the processed artwork and thumbnails, and returns the processed images view.
    :return: [RenderView | RenderView] The rendered view, or a redirection if the session has no processed image.
    """
    if const.SessionFields.generated_artwork_path.value not in session:
        return renderRedirection(const.ROUTES.art_gen.path, const.ERR_NO_IMG)

    user_folder = str(session[const.SessionFields.user_folder.value])
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    generated_artwork_path = str(session[const.SessionFields.generated_artwork_path.value])
    include_center_artwork = session.get(const.SessionFields.include_center_artwork.value, True)
    output_bg = path.join(user_processed_path, const.PROCESSED_ARTWORK_FILENAME)
    generateCoverArt(generated_artwork_path, output_bg, include_center_artwork)
    generateThumbnails(output_bg, user_processed_path)
    log.log("Image generation completed successfully.")
    updateStats(to_increment="artworkGenerations")

    context: Context = {
        const.SessionFields.user_folder.value: user_folder,
    }
    return render_template(const.ROUTES.proc_img.view_filename, **context)
