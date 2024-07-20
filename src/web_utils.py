from flask import jsonify

from src.typing import JsonResponse

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
