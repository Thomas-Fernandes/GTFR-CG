from src.installer import install_requirements

install_requirements()

#################################

from src.app import main

import src.constants as const

if __name__ == '__main__':
    main(const.HOST_HOME, const.DEFAULT_PORT)
