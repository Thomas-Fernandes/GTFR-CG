import { sendToast } from "./Toast";

export const showSpinner = (name: string) => {
  if (!name) {
    sendToast("HTML Spinner id is required", "error");
    return;
  }

  const button = document.getElementById(name);

  // Create spinner container if it doesn't exist
  if (button?.querySelector(".spinner-container") === null) {
    const spinnerContainer = document.createElement("div");
    spinnerContainer.classList.add("spinner-container");
    spinnerContainer.id = "spinner-container" + "-" + name;

    const spinner = document.createElement("span");
    spinner.classList.add("spinner");

    const favicon = document.createElement("img");
    favicon.src = "/favicon.ico";
    favicon.alt = "favicon";
    spinner.appendChild(favicon);

    spinnerContainer.appendChild(spinner);
    button.appendChild(spinnerContainer);
  }

  // Show the spinner
  const spinnerContainer: HTMLElement = button?.querySelector(".spinner-container") as HTMLElement;
  if (!spinnerContainer) {
    sendToast("Spinner container not found", "error");
    return;
  }
  spinnerContainer.style.display = "block";
  spinnerContainer.style.alignSelf = "center";
}

export const hideSpinner = (name: string) => {
  const spinnerContainer = document.getElementById("spinner-container" + "-" + name);
  if (spinnerContainer) {
    spinnerContainer.style.display = "none";
  }
}
