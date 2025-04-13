import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

import { IcoPaths } from "@/constants/media";
import { sendToast } from "./Toast";

const createSpinnerContainer = (spinnerDiv: HTMLElement, name: string) => {
  const spinnerContainer = document.createElement("div");
  spinnerContainer.classList.add("spinner-container");
  spinnerContainer.id = `spinner-container-${name}`;

  const spinner = document.createElement("span");
  spinner.classList.add("spinner");

  const favicon = document.createElement("img");
  favicon.src = IcoPaths.Genius;
  favicon.alt = "genius";
  spinner.appendChild(favicon);

  spinnerContainer.appendChild(spinner);
  spinnerDiv.appendChild(spinnerContainer);
};

export const showSpinner = (name: string) => {
  const toasts = getToasts();

  if (!name) {
    sendToast(toasts.Components.NoSpinnerId, ToastType.Error);
    return;
  }

  const spinnerDiv = document.getElementById(name);

  // Create spinner container if it doesn't exist
  if (spinnerDiv?.querySelector(".spinner-container") === null) {
    createSpinnerContainer(spinnerDiv, name);
  }

  // Show the spinner
  const spinnerContainer = spinnerDiv?.querySelector(".spinner-container") as HTMLDivElement;
  if (!spinnerContainer) {
    sendToast(toasts.Components.NoSpinnerContainer, ToastType.Error);
    return;
  }

  if (name.startsWith("home_stat")) {
    spinnerContainer.style.scale = "0.5";
  } else {
    spinnerContainer.style.display = "block";
    spinnerContainer.style.alignSelf = "center";
  }
};

export const hideSpinner = (name: string) => {
  const spinnerContainer = document.getElementById(`spinner-container-${name}`);
  if (spinnerContainer) {
    spinnerContainer.style.display = "none";
  }
};
