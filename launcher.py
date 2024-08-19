from installer import installPythonReq

import src.constants as const
from src.app import main

if __name__ == '__main__':
    installPythonReq()
    main(const.HOST_HOME, const.DEFAULT_PORT)
