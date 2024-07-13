from subprocess import run

from src.logger import log

def install_requirements() -> None:
    log.info("Installing requirements...")
    result = run(["pip", "install", "-r", "requirements.txt"], capture_output=True, text=True)

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
        if line.startswith("WARNING: The script") and line.startswith("Consider adding this directory to PATH"):
            log.error(line)
