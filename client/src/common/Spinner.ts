import { Toast, ToastType } from "@/constants/toasts";

import { sendToast } from "./toast";

const createSpinnerContainer = (spinnerDiv: HTMLElement, name: string) => {
  const spinnerContainer = document.createElement("div");
  spinnerContainer.classList.add("spinner-container");
  spinnerContainer.id = `spinner-container-${name}`;

  const spinner = document.createElement("span");
  spinner.classList.add("spinner");

  const favicon = document.createElement("img");
  favicon.src = "/favicon.ico";
  favicon.alt = "favicon";
  spinner.appendChild(favicon);

  spinnerContainer.appendChild(spinner);
  spinnerDiv.appendChild(spinnerContainer);
};

export const showSpinner = (name: string) => {
  if (!name) {
    sendToast(Toast.NoSpinnerId, ToastType.Error);
    return;
  }

  const spinnerDiv = document.getElementById(name);

  // Create spinner container if it doesn't exist
  if (spinnerDiv?.querySelector(".spinner-container") === null)
    createSpinnerContainer(spinnerDiv, name);

  // Show the spinner
  const spinnerContainer = spinnerDiv?.querySelector(".spinner-container") as HTMLDivElement;
  if (!spinnerContainer) {
    sendToast(Toast.NoSpinnerContainer, ToastType.Error);
    return;
  }
  spinnerContainer.style.display = "block";
  spinnerContainer.style.alignSelf = "center";
}

export const hideSpinner = (name: string) => {
  const spinnerContainer = document.getElementById(`spinner-container-${name}`);
  if (spinnerContainer) {
    spinnerContainer.style.display = "none";
  }
}
