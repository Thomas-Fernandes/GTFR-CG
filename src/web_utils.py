from flask import jsonify, Response

from typing import TypeAlias

import src.constants as constants

def checkFilenameValid(filename: str | None) -> str | None:
    if (filename == None or filename.strip() == ''):
        return constants.ERR_NO_FILE
    if (not('.' in filename and filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg'])):
        return constants.ERR_INVALID_FILE_TYPE
    return None

JsonResponse: TypeAlias = tuple[Response, int]

def createJsonResponse(status_code: int, message: str = "") -> JsonResponse:
    if (status_code == 200):
        status = 'success'
    elif (status_code in [400, 404, 500]):
        status = 'error'
    else:
        status = 'unknown'

    response = {'status': status}
    if (message):
        response['message'] = message
    return (jsonify(response), status_code)
