import sys
sys.path.append("..") # need to add parent directory to path to import from installer
from installer import installPythonReq

import server.src.constants as const
from server.src.app import main

if __name__ == '__main__':
    installPythonReq()
    main(const.HOST_HOME, const.DEFAULT_PORT)
