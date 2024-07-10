from os import system

system('pip install -qr requirements.txt')

#################################

from src.app import main

import src.constants as const

if __name__ == '__main__':
    main(const.HOST_HOME, const.DEFAULT_PORT)
