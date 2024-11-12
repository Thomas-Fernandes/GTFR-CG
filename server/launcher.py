import sys
sys.path.append("..") # need to add parent directory to path to import from installer
from installer import installPythonReq

from server.src.constants.paths import DEFAULT_PORT, HOST_HOME

from server.src.app import main

if __name__ == '__main__':
    installPythonReq()
    main(HOST_HOME, DEFAULT_PORT)
