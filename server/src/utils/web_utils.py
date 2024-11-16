from flask import jsonify, Response

from typing import Optional

def createApiResponse(status_code: int, message: str = "", data: Optional[object] = None) -> Response:
    """ Creates a JSON response with the given status code and message
    :param status_code: [integer] The status code of the response
    :param message: [string] The message to include in the response (default: "")
    :param data: [object?] The data to include in the response (default: None)
    :return: [Response] The response of the request
    """
    return jsonify(
        status=status_code,
        message=message,
        data=data,
    )
