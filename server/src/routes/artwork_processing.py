from flask import Blueprint, Response
from flask_restx import Resource
from PIL import Image, ImageFilter as IFilter, ImageDraw as IDraw

from os import path
from time import time
from typing import Optional

from server.src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, SessionFields
from server.src.constants.paths import \
    API_ROUTE, FRONT_PROCESSED_ARTWORKS_DIR, LOGO_POSITIONS, PROCESSED_ARTWORK_FILENAME, PROCESSED_DIR, ROUTES, SLASH, THUMBNAILS_DIR
from server.src.constants.responses import Err, Msg
from server.src.docs import models, ns_artwork_processing
from server.src.logger import log, LogSeverity
from server.src.statistics import updateStats
from server.src.utils.string_utils import getSessionFirstName
from server.src.utils.web_utils import createApiResponse

from server.src.app import api, app
bp_artwork_processing = Blueprint(ROUTES.art_proc.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = API_ROUTE + ROUTES.art_proc.path
api.add_namespace(ns_artwork_processing, path=api_prefix)

def addGaussianBlur(cropped_image: Image.Image, original_image: Image.Image) -> Image.Image:
    """ Adds a Gaussian blur to the given image
    :param original_image: [Image__Image] The original image as a reference
    :param cropped_image: [Image__Image] The image to blur
    :return: [Image__Image] The blurred image
    """
    log.debug("  Applying Gaussian blur and radial mask...")
    blurred_image: Image.Image = cropped_image.filter(IFilter.GaussianBlur(radius=25))

    mask = Image.new("L", cropped_image.size, "black")
    draw: IDraw.ImageDraw = IDraw.Draw(mask)
    max_dim = min(cropped_image.size) / 2
    center_x, center_y = cropped_image.size[0] // 2, cropped_image.size[1] // 2

    for i in range(int(max_dim)):
        opacity = 255 - int((255 * i) / max_dim)
        coords = [
            center_x - i, center_y - i,
            center_x + i, center_y + i
        ]
        draw.ellipse(coords, fill=opacity)

    final_image = Image.composite(cropped_image, blurred_image, mask)

    center_image: Image.Image = original_image.resize((800, 800), Image.Resampling.LANCZOS)
    (top_left_x, top_left_y) = (center_x - 400, center_y - 400)
    final_image.paste(center_image, (top_left_x, top_left_y))
    return final_image

def generateCoverArt(input_path: str, output_path: str, include_center_artwork: bool = True) -> None:
    """ Generates the cover art for the given input image and saves it to the output path
    :param input_path: [string] The path to the input image
    :param output_path: [string] The path to save the output image
    :param include_center_artwork: [bool] Whether to include the center artwork in the cover art (default: True)
    """
    log.info(f"Generating cover art... (session {getSessionFirstName(input_path)}-...)")

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
        final_image = addGaussianBlur(cropped_image, image)

    final_image.save(output_path)
    final_image.save(f"{FRONT_PROCESSED_ARTWORKS_DIR}{PROCESSED_ARTWORK_FILENAME}")
    log.debug(f"Cover art saved: {output_path}")

def generateThumbnail(position: str, user_folder: str, bg_path: str, output_folder: str) -> Optional[str]:
    log.debug(f"  Generating {position} thumbnail...")
    logo_path = f"{position}.png"
    overlay_file = f"{user_folder}{SLASH}{THUMBNAILS_DIR}{logo_path}"
    if (not path.exists(overlay_file)):
        log.err(f"  Overlay file not found: {overlay_file}")
        return Err.Error.ERR_OVERLAY_NOT_FOUND
    overlay = Image.open(overlay_file)

    background = Image.open(bg_path)
    new_background = Image.new("RGBA", background.size)
    new_background.paste(background, (0, 0))
    new_background.paste(overlay, mask=overlay)

    final_image = new_background.convert("RGB")
    output_path = path.join(output_folder, f"thumbnail_{position}.png")
    final_image.save(output_path)
    final_image.save(f"{FRONT_PROCESSED_ARTWORKS_DIR}thumbnail_{position}.png")
    log.debug(f"  Thumbnail saved: {output_path}")
    return None

def generateThumbnails(bg_path: str, output_folder: str) -> Optional[str]:
    """ Generates the thumbnails for the given background image and saves them in the output folder
    :param bg_path: [string] The path to the background image
    :param output_folder: [string] The path to the folder where the thumbnails will be saved
    """
    log.info(f"Generating thumbnails... (session {bg_path.split(SLASH)[-3].split('-')[0]}-...)")

    user_folder = path.abspath(str(session[SessionFields.user_folder]))
    user_folder = SLASH.join(user_folder.split(SLASH)[:-1])
    for position in LOGO_POSITIONS:
        err = generateThumbnail(position, user_folder, bg_path, output_folder)
        if err:
            return err
    return None

@ns_artwork_processing.route("/process-artworks")
class ProcessArtworkResource(Resource):
    @ns_artwork_processing.doc("post_process_images")
    @ns_artwork_processing.expect(models[ROUTES.art_proc.bp_name]["process-artworks"]["payload"])
    @ns_artwork_processing.response(HttpStatus.CREATED, Msg.MSG_PROCESSED_IMAGES_SUCCESS)
    @ns_artwork_processing.response(HttpStatus.BAD_REQUEST, Err.ERR_NO_IMG)
    @ns_artwork_processing.response(HttpStatus.PRECONDITION_FAILED, Err.ERR_OVERLAY_NOT_FOUND)
    def post(self) -> Response:
        """ Renders the processed background image and thumbnails """
        if SessionFields.generated_artwork_path not in session:
            log.error(Err.ERR_NO_IMG)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.ERR_NO_IMG)

        user_folder = str(session[SessionFields.user_folder]) + SLASH + AvailableCacheElemType.artworks
        user_processed_path = path.join(PROCESSED_DIR, user_folder)
        generated_artwork_path = str(session[SessionFields.generated_artwork_path])
        include_center_artwork = session.get(SessionFields.include_center_artwork, True)
        output_bg = path.join(user_processed_path, PROCESSED_ARTWORK_FILENAME)

        start = time()
        generateCoverArt(generated_artwork_path, output_bg, include_center_artwork)
        err = generateThumbnails(output_bg, user_processed_path)
        if err:
            return createApiResponse(HttpStatus.PRECONDITION_FAILED, err)
        center_mark = "with" if include_center_artwork else "without"
        log.log(f"Images generation ({center_mark} center artwork) complete.").time(LogSeverity.LOG, time() - start)
        updateStats(to_increment=AvailableStats.artworkGenerations)

        return createApiResponse(HttpStatus.CREATED, Msg.MSG_PROCESSED_IMAGES_SUCCESS)
