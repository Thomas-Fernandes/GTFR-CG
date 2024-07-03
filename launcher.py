from os import system

system('pip install -qr requirements.txt')

#################################

from src.app import main

import src.constants as constants

if __name__ == '__main__':
    main(constants.HOST_HOME, constants.DEFAULT_PORT)
