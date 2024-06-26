from flask import jsonify

def createJsonResponse(status_code: int, message: str = "") -> tuple[str, int]:
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
