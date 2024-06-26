from flask import jsonify

def createJsonResponse(status_code: int, status: str, message: str = "") -> tuple[str, int]:
    response = {'status': status}
    if message:
        response['message'] = message
    return jsonify(response), status_code
