from os import environ, name as osName, pathsep
from subprocess import CalledProcessError, CompletedProcess, run
from typing import Optional

from src.logger import log, LogSeverity

@staticmethod
def quitIfError(result: CompletedProcess[bytes]) -> None:
    """ Quits the installation if an error occurred.
    :param result: [CompletedProcess] The result of the subprocess.
    """
    if result.returncode not in [0, 2316632107]:
        log.critical(f"Error while trying to install React: {result.stderr}")
        exit(1)

@staticmethod
def installNode() -> None:
    def getNodeVersion() -> Optional[str]:
        """ Checks if Node.js is installed.
        :return: [bool] True if Node.js is installed, False otherwise.
        """
        try:
            result = run(["node", "-v"], capture_output=True, text=True)
            return result.stdout.strip()
        except FileNotFoundError:
            return None

    def addNodeToPath() -> None:
        """ Adds Node.js to the PATH environment variable, necessary for Windows.
        """
        node_path = r"C:\Program Files\nodejs" # Update this path if Node.js is installed elsewhere
        current_path = environ.get("PATH", "")
        if node_path not in current_path:
            new_path = current_path + pathsep + node_path
            environ["PATH"] = new_path

    def launchNodeJsInstallation() -> None:
        """ Installs Node.js, needed for React.
        """
        log.log("  Installing Node.js...")

        try:
            if osName == "nt": # Windows
                try:
                    quitIfError(run(["winget", "install", "OpenJS.NodeJS"], capture_output=True, check=True))
                except CalledProcessError as e:
                    if e.returncode not in [0, 2316632107]: # package installed, or already installed
                        raise e
            else: # Ubuntu
                quitIfError(run(["sudo", "apt-get", "update"], capture_output=True, check=True))

                quitIfError(run(["curl", "-fsSL", "https://deb.nodesource.com/setup_20.x", "-o", "/tmp/nodesource_setup.sh"], capture_output=True, check=True))
                quitIfError(run(["sudo", "bash", "/tmp/nodesource_setup.sh"], capture_output=True, check=True))
                quitIfError(run(["sudo", "apt-get", "install", "-y", "nodejs"], capture_output=True, check=True))

            result = run(["node", "-v"], capture_output=True, text=True) # Verify installation
            if result.returncode != 0:
                log.error(f"  Error while verifying Node version: {result.stderr}")
        except CalledProcessError as e:
            log.critical(f"  Error while trying to install Node: {e}")
            exit(1)
        log.log(f"  Node.js {result.stdout.strip()} installation complete.")

    if osName == "nt": addNodeToPath() # Windows
    installedNodeVersion = getNodeVersion()
    if installedNodeVersion is not None:
        log.log(f"  Node.js {installedNodeVersion} is already installed.")
        return
    launchNodeJsInstallation()

def installReactReq() -> None:
    """ Installs the software required by the front-end application.
    """
    log.log("Installing React requirements...")
    installNode()
    log.log("React requirements installation complete.\n")

def installPythonReq(req_path: str = "requirements.txt") -> None:
    """ Installs the packages required by the application, from the requirements file.
    :param req_path: [string] The path to the requirements file. (default: "requirements.txt")
    """
    log.log("Installing Python requirements...")
    result = run(["pip", "install", "-r", req_path], capture_output=True, text=True)

    installed_packages: list[str] = []

    for line in result.stdout.splitlines():
        if "Successfully installed" in line:
            installed_packages.extend(line.split()[2:])

    if len(installed_packages) > 0:
        for package in installed_packages:
            log.log(f"  New package installed: {package}")
        log.log("Python requirements installation complete.")
    else:
        log.log("All the required Python packages were already installed.")

    for line in result.stderr.splitlines():
        # Filter warning and message
        if "WARNING: The script" not in line and "Consider adding this directory to PATH" not in line:
            log.error(line)

    if log.getSeverity() < LogSeverity.LOG:
        print() # Add a newline for better readability
