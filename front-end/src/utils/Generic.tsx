import { defaultEventDuration } from "./Constants";
import { ResponseStatus } from "./Types";

const convertToHtmlMessage = (message: string) => {
  return message.trim()
    .replace(/\r/g, "")
    .replace(/\n/g, "<br>")
    .replace(/ {2}/g, "&nbsp;&nbsp;")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
  ;
};
const sendToast = (
  message: string,
  type: ResponseStatus = "error",
  duration: number = defaultEventDuration.SECONDS_TOAST
) => {
  const toast = document.createElement("div");
  toast.className = "toast " + type.trim().toLowerCase();
  toast.innerHTML = convertToHtmlMessage(message);

  const progressBar = document.createElement("div");
  progressBar.className = "toast-progress " + type.trim().toLowerCase();
  toast.appendChild(progressBar);
  const progressFill = document.createElement("div");
  progressFill.className = "toast-progress-fill " + type.trim().toLowerCase();
  progressBar.appendChild(progressFill);

  document.getElementById("toast-container")?.appendChild(toast);

  setTimeout(() => { // Use setTimeout to ensure the initial styles are applied before transitioning
   toast.classList.add("show");
   progressFill.style.width = "100%";
   progressFill.style.transitionDuration = `${duration}s`;
   setTimeout(() => {
     progressFill.style.width = "0%";
   }, 10);
  }, 10);
  toast.addEventListener("click", () => {
    dismissToast(toast);
  });
  setTimeout(() => {
    dismissToast(toast);
  }, duration * 1000);
}

const dismissToast = (toast: HTMLElement, duration: number = defaultEventDuration.MS_FADE_OUT) => {
  toast.style.animation = `fade-out ${duration.toString()}ms forwards`;
  setTimeout(() => {
    toast.style.marginTop = `-${toast.offsetHeight}px`;
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      document.getElementById("toast-container")?.offsetHeight; // Reflow to ensure the transition applies correctly
    }, duration);
  }, defaultEventDuration.MS_VERTICAL_SLIDE);
}

const showSpinner = (name: string) => {
  if (!name) {
    sendToast("HTML Spinner id is required", "error");
    return;
  }
  if (name === "lyrics_search") {
    const hasInvalidField =
      !((document.getElementById("artist") as HTMLInputElement)?.value)
      || !((document.getElementById("song") as HTMLInputElement)?.value);
    if (hasInvalidField)
      return; // Do not show spinner if the form is not fully filled
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
    favicon.src = "/static/favicon.ico";
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
const hideSpinner = (name: string) => {
  const spinnerContainer = document.getElementById("spinner-container" + "-" + name);
  if (spinnerContainer) {
    spinnerContainer.style.display = "none";
  }
}

export { convertToHtmlMessage, sendToast, dismissToast, showSpinner, hideSpinner };