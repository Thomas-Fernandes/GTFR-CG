from installer import installPythonReq

from src.app import main
from src.constants.paths import DEFAULT_PORT, HOST_HOME

if __name__ == '__main__':
    installPythonReq()
    main(HOST_HOME, DEFAULT_PORT)
