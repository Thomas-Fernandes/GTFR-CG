from flask import jsonify

def createJsonResponse(status_code: int, message: str = "") -> tuple:
    if status_code == 200:
        status = 'success'
    elif status_code == 400:
        status = 'error'
    elif status_code == 500:
        status = 'error'
    else:
        status = 'unknown'

    response = {'status': status}
    if (message):
        response['message'] = message
    return jsonify(response), status_code
