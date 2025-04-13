from os import chdir, environ, name as osName, path, pathsep, system
from subprocess import CalledProcessError, CompletedProcess, Popen, run
from typing import Optional

requirements_path = "requirements.txt" if path.isfile("requirements.txt") else "server/requirements.txt"
result = run(
    ["pip", "install", "-r", requirements_path], capture_output=True, text=True
)  # needs to be run before importing logger

from src.logger import log, SeverityLevel


def quitIfError(result: CompletedProcess[bytes]) -> None:
    """Quits the installation if an error occurred
    :param result: [CompletedProcess] The result of the subprocess
    """
    if result.returncode not in [0, 2316632107]:  # package installed, or already installed
        log.critical(f"Error while trying to install React: {result.stderr.decode('utf-8')}")
        exit(1)

def installNodePackages() -> None:
    """Installs the Node packages required by the front end application"""
    log.info("  Installing Node packages...")

    def launchNodePackagesInstallation() -> None:
        chdir("client")
        if osName == "nt":
            system("npm install --silent")
        else:
            quitIfError(run(["npm", "install", "--silent"], capture_output=True, check=True))
        chdir("..")
        log.info("  Node packages installation complete.")

    launchNodePackagesInstallation()


def installNvm() -> None:
    """Installs Nvm, needed for Node"""

    def getNvmVersion() -> Optional[str]:
        """Checks if Nvm is installed
        :return: [str] The version of Nvm if it is installed, None otherwise
        """
        try:
            if osName == "nt":  # Windows
                run(["powershell", "-Command", "nvm version"], check=True, shell=True)
                return ""
            else:  # Ubuntu
                nvm_script = "$HOME/.nvm/nvm.sh"
                result = run(
                    f"source {nvm_script} && nvm --version",
                    capture_output=True,
                    text=True,
                    check=True,
                    shell=True,
                    executable="/bin/bash",
                )
                return " " + result.stdout.strip()
        except CalledProcessError:
            return None

    def launchNvmInstallation() -> None:
        log.info("  Installing Nvm...")
        try:
            if osName == "nt":
                chdir("client")
                Popen(r'explorer /select,"install-nvm.ps1"')
                chdir("..")
                input(
                    "Please install Nvm by running 'install-nvm.ps1' with PowerShell.\n"
                    "\tYou may need to restart your terminal or even reboot to use Nvm.\n"
                    "\tPress Enter to continue..."
                )
            else:
                quitIfError(run(["sudo", "apt-get", "update"], capture_output=True, check=True))
        except CalledProcessError as e:
            log.critical(f"  Error while trying to install Nvm: {e}")
            exit(1)
        log.info("  Nvm installation complete.")

    installedNvmVersion = getNvmVersion()
    if installedNvmVersion is not None:
        log.info(f"  Nvm{installedNvmVersion} is already installed.")
        return
    launchNvmInstallation()


def installNode() -> None:
    """Installs NodeJs, needed for React"""

    def getNodeVersion() -> Optional[str]:
        """Checks if NodeJs is installed
        :return: [str] The version of NodeJs if it is installed, None otherwise
        """
        try:
            result = run(["node", "-v"], capture_output=True, text=True)
            return result.stdout.strip()
        except FileNotFoundError:
            return None

    def launchNodeJsInstallation() -> None:
        log.info("  Installing Node.js...")

        try:
            if osName == "nt":  # Windows
                try:
                    quitIfError(run(["winget", "install", "OpenJS.NodeJS"], capture_output=True, check=True))
                except CalledProcessError as e:
                    if e.returncode not in [0, 2316632107]:  # package installed, or already installed
                        raise e
            else:  # Ubuntu
                quitIfError(run(["sudo", "apt-get", "update"], capture_output=True, check=True))

                quitIfError(
                    run(
                        ["curl", "-fsSL", "https://deb.nodesource.com/setup_20.x", "-o", "/tmp/nodesource_setup.sh"],
                        capture_output=True,
                        check=True,
                    )
                )
                quitIfError(run(["sudo", "bash", "/tmp/nodesource_setup.sh"], capture_output=True, check=True))
                quitIfError(run(["sudo", "apt-get", "install", "-y", "nodejs"], capture_output=True, check=True))
        except CalledProcessError as e:
            log.critical(f"  Error while trying to install Node: {e}")
            exit(1)

        result = run(["node", "-v"], capture_output=True, text=True)  # Verify installation
        if result.returncode != 0:
            log.error(f"  Error while verifying Node version: {result.stderr}")
        log.info(f"  Node {result.stdout.strip()} installation complete.")

    if osName == "nt":  # Windows
        environ["Path"] += pathsep + r"C:\Program Files\nodejs"  # Add Node.js to PATH
    installedNodeVersion = getNodeVersion()
    if installedNodeVersion is not None:
        log.info(f"  Node {installedNodeVersion} is already installed.")
        return
    launchNodeJsInstallation()


def installReactReq() -> None:
    """Installs the software required by the front end application"""
    log.info("Installing React requirements...")
    installNode()
    installNvm()
    installNodePackages()
    log.info("React requirements installation complete.")


def installPythonReq() -> None:
    """Installs the packages required by the application, from the requirements file"""
    log.info("Installing Python requirements...")

    installed_packages: list[str] = []

    for line in result.stdout.splitlines():
        if "Successfully installed" in line:
            installed_packages.extend(line.split()[2:])

    if len(installed_packages) > 0:
        for package in installed_packages:
            log.info(f"  New package installed: {package}")
        log.info("Python requirements installation complete.")
    else:
        log.info("All required Python packages are already installed.")

    for line in result.stderr.splitlines():
        # Filter warning and message
        if "WARNING: The script" not in line and "Consider adding this directory to PATH" not in line:
            log.error(line)

    if log.getSeverity() < SeverityLevel.INFO:
        print()  # Add a newline for better readability


if __name__ == '__main__':
    installPythonReq()
    installReactReq()
