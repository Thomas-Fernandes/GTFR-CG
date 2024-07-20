from installer import installPythonReq, installReactReq

import src.constants as const
from src.app import main

if __name__ == '__main__':
    installPythonReq()
    installReactReq()
    main(const.HOST_HOME, const.DEFAULT_PORT)
