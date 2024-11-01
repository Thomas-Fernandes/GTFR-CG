import { DEFAULT_EVENT_DURATION, TOAST_TYPE } from "@constants/toasts";

import { ToastType } from "./types";

const convertToHtmlMessage = (message: string) => {
  return message.trim()
    .replace(/\r/g, "")
    .replace(/\n/g, "<br />")
    .replace(/ {2}/g, "&nbsp;&nbsp;")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
  ;
};
const flattenMessage = (message: string) => {
  return message.trim()
    .replace(/\r/g, "")
    .replace(/\n/g, " ")
    .replace(/ {2}/g, "  ")
    .replace(/\t/g, "    ")
  ;
};

export const sendToast = (
  message: string,
  type: ToastType = TOAST_TYPE.ERROR,
  duration: number = DEFAULT_EVENT_DURATION.SECONDS_TOAST
) => {
  if (type === TOAST_TYPE.ERROR)
    console.error(`Toast: ${type} - ${flattenMessage(message)}`);
  else if (type === TOAST_TYPE.WARN)
    console.log(`Toast: ${type} - ${flattenMessage(message)}`);

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
   }, DEFAULT_EVENT_DURATION.MS_PROGRESS_UPDATE);
  }, DEFAULT_EVENT_DURATION.MS_PROGRESS_UPDATE);

  toast.addEventListener("click", () => {
    dismissToast(toast);
  });
  setTimeout(() => {
    dismissToast(toast);
  }, duration * 1000);
};

export const dismissToast = (toast: HTMLElement, duration: number = DEFAULT_EVENT_DURATION.MS_FADE_OUT) => {
  toast.style.animation = `fade-out ${duration.toString()}ms forwards`;
  setTimeout(() => {
    toast.style.marginTop = `-${toast.offsetHeight}px`;
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      document.getElementById("toast-container")?.offsetHeight; // Reflow to ensure the transition applies correctly
    }, duration);
  }, DEFAULT_EVENT_DURATION.MS_VERTICAL_SLIDE);
};
