from flask import Blueprint, Response
from flask_restx import Resource
from PIL import Image, ImageFilter, ImageDraw

from os import path
from time import time

import src.constants as const
from src.docs import models, ns_artwork_processing
from src.logger import log, LogSeverity
from src.statistics import updateStats
from src.utils.web_utils import createApiResponse

from src.app import api, app
bp_processed_images = Blueprint(const.ROUTES.art_proc.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.art_proc.path
api.add_namespace(ns_artwork_processing, path=api_prefix)

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

    log.debug("  Resizing image...") # make img 1920px wide, keep aspect ratio
    base_width = 1920
    w_percent = (base_width / float(image.size[0]))
    h_size = int((float(image.size[1]) * float(w_percent)))
    resized_image: Image.Image = image.resize((base_width, h_size), Image.Resampling.LANCZOS)

    log.debug("  Cropping image...") # make img 1080px high, crop the top and bottom
    top = (h_size - 1080) // 2
    bottom = (h_size + 1080) // 2
    cropBox = (0, top, 1920, bottom)
    cropped_image = resized_image.crop(cropBox)

    if (include_center_artwork == False):
        final_image = cropped_image
    else:
        log.debug("  Applying Gaussian blur and radial mask...")
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

        final_image = Image.composite(cropped_image, blurred_image, mask)

        center_image: Image.Image = image.resize((800, 800), Image.Resampling.LANCZOS)
        (top_left_x, top_left_y) = (center_x - 400, center_y - 400)
        final_image.paste(center_image, (top_left_x, top_left_y))

    final_image.save(output_path)
    final_image.save(f"./front-end/public/processed-images/{const.PROCESSED_ARTWORK_FILENAME}")
    log.debug(f"Cover art saved: {output_path}")

def generateThumbnails(bg_path: str, output_folder: str) -> None:
    """ Generates the thumbnails for the given background image and saves them in the output folder.
    :param bg_path: [string] The path to the background image.
    :param output_folder: [string] The path to the folder where the thumbnails will be saved.
    """
    log.info(f"Generating thumbnails... (session {bg_path.split(const.SLASH)[-3].split('-')[0]}-...)")

    for position in const.LOGO_POSITIONS:
        log.debug(f"  Generating {position} thumbnail...")
        logo_path = f"{position}.png"
        user_folder = path.abspath(str(session[const.SessionFields.user_folder.value]))
        user_folder = const.SLASH.join(user_folder.split(const.SLASH)[:-1])
        overlay_file = f"{user_folder}{const.SLASH}{const.THUMBNAILS_DIR}{logo_path}"
        if (not path.exists(overlay_file)):
            log.warn(f"  Overlay file not found: {overlay_file}")
            break
        overlay = Image.open(overlay_file)

        background = Image.open(bg_path)
        new_background = Image.new("RGBA", background.size)
        new_background.paste(background, (0, 0))
        new_background.paste(overlay, mask=overlay)

        final_image = new_background.convert("RGB")
        output_path = path.join(output_folder, f"thumbnail_{position}.png")
        final_image.save(output_path)
        final_image.save(f"{const.FRONT_PROCESSED_IMAGES_DIR}thumbnail_{position}.png")
        log.debug(f"  Thumbnail saved: {output_path}")

@ns_artwork_processing.route("/process-images")
class ProcessArtworkResource(Resource):
    @ns_artwork_processing.doc("post_process_images")
    @ns_artwork_processing.response(const.HttpStatus.CREATED.value, const.MSG_PROCESSED_IMAGES_SUCCESS, models[const.ROUTES.art_proc.bp_name]["process-images"])
    @ns_artwork_processing.response(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG)
    def post(self) -> Response:
        """ Renders the processed background image and thumbnails. """
        if const.SessionFields.generated_artwork_path.value not in session:
            log.error(const.ERR_NO_IMG)
            return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG)

        user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.images.value
        user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
        generated_artwork_path = str(session[const.SessionFields.generated_artwork_path.value])
        include_center_artwork = session.get(const.SessionFields.include_center_artwork.value, True)
        output_bg = path.join(user_processed_path, const.PROCESSED_ARTWORK_FILENAME)

        start = time()
        generateCoverArt(generated_artwork_path, output_bg, include_center_artwork)
        generateThumbnails(output_bg, user_processed_path)
        center_mark = "with" if include_center_artwork else "without"
        log.log(f"Images generation ({center_mark} center artwork) complete.").time(LogSeverity.LOG, time() - start)
        updateStats(to_increment=const.AvailableStats.artworkGenerations.value)

        return createApiResponse(const.HttpStatus.CREATED.value, const.MSG_PROCESSED_IMAGES_SUCCESS)
