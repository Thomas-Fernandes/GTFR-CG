from subprocess import run

from src.logger import log

def install_requirements(req_path: str = "requirements.txt") -> None:
    """ Installs the packages required by the application, from the requirements file.
    :param req_path: [string] The path to the requirements file. (default: "requirements.txt")
    """
    log.info("Installing requirements...")
    result = run(["pip", "install", "-r", req_path], capture_output=True, text=True)

    installed_packages: list[str] = []

    for line in result.stdout.splitlines():
        if "Successfully installed" in line:
            installed_packages.extend(line.split()[2:])

    if installed_packages:
        for package in installed_packages:
            log.info(f"New package installed: {package}")
    else:
        log.info("All packages were already installed.")

    for line in result.stderr.splitlines():
        # Filter warning and message
        if "WARNING: The script" not in line and "Consider adding this directory to PATH" not in line:
            log.error(line)

    print() # Add a newline for better readability
install_requirements()

#################################

from src.app import main

import src.constants as const

if __name__ == '__main__':
    main(const.HOST_HOME, const.DEFAULT_PORT)
