import { TOAST, TOAST_TYPE } from "../constants/Toast";

import { sendToast } from "./Toast";

export const showSpinner = (name: string) => {
  if (!name) {
    sendToast(TOAST.NO_SPINNER_ID, TOAST_TYPE.ERROR);
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
  const spinnerContainer = button?.querySelector(".spinner-container") as HTMLElement;
  if (!spinnerContainer) {
    sendToast(TOAST.NO_SPINNER_CONTAINER, TOAST_TYPE.ERROR);
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
