from flask import jsonify

from src.typing import JsonResponse
import src.constants as constants

def checkImageFilenameValid(filename: str | None) -> str | None:
    if (filename == None or filename.strip() == ''):
        return constants.ERR_NO_FILE
    if (not('.' in filename and filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg'])):
        return constants.ERR_INVALID_FILE_TYPE
    return None

def createJsonResponse(status_code: int, message: str = "") -> JsonResponse:
    match status_code:
        case 200:
            status = 'success'
        case 400, 404, 500:
            status = 'error'
        case _:
            status = 'unknown'

    response = {'status': status}
    message = message.strip()
    if (len(message) > 1):
        response['message'] = message
    return (jsonify(response), status_code)
