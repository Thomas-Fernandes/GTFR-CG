from flask import jsonify

from typing import Optional

import src.constants as const
from src.typing import JsonResponse

def checkImageFilenameValid(filename: str | None) -> Optional[str]:
    """ Checks if the given filename is valid for an image file.
    :param filename: [string] The filename to check.
    :return: [string?] The error message if the filename is invalid, None otherwise.
    """
    if filename == None or filename.strip() == "":
        return const.ERR_NO_FILE
    if not('.' in filename and filename.rsplit('.', 1)[1].lower() in ["png", "jpg", "jpeg"]):
        return const.ERR_INVALID_FILE_TYPE
    return None

def createJsonResponse(status_code: int, message: str = "") -> JsonResponse:
    """ Creates a JSON response with the given status code and message.
    :param status_code: [integer] The status code of the response.
    :param message: [string] The message to include in the response. (default: "")
    :return: [JsonResponse] The JSON response and its status code.
    """
    match status_code:
        case 200:
            status = "success"
        case 400, 404, 500:
            status = "error"
        case _:
            status = "unknown"

    response = { "status": status }
    message = message.strip()
    if len(message) > 1:
        response["message"] = message
    return (jsonify(response), status_code)
