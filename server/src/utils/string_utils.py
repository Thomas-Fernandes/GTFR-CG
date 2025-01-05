from src.constants.paths import SLASH

def getHexColorFromRGB(rgb: tuple[int, int, int]) -> str:
    """ Converts an RGB color to a hex color
    :param rgb: [tuple] The RGB color
    :return: [string] The hex color
    """
    return "#{:02x}{:02x}{:02x}".format(*rgb)

def stringIsBool(string: str) -> bool:
    """ Checks if a string is a boolean
    :param string: [string] The string to check
    :return: [bool] Whether the string is a boolean
    """
    return string.capitalize() in [str(True), str(False)]

def getSessionFirstName(session_name: str) -> str:
    """ Returns the first segment of the session id
    :return: [string] The first segment of the session id
    """
    return session_name.split(SLASH)[-2].split('-')[0]

def snakeToCamel(snake_str: str) -> str:
    """ Converts a snake_case string to a camelCase string
    :param snake_str: [string] The snake_case string
    :return: [string] The camelCase string
    """
    components = snake_str.split("_")
    return components[0] + "".join(x.title() for x in components[1:])
