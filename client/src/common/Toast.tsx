import { ResponseStatus } from "@/constants/requests";
import { DEFAULT_EVENT_DURATION, ToastType } from "@/constants/toasts";

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
  type: ResponseStatus = ToastType.Error,
  duration: number = DEFAULT_EVENT_DURATION.SECONDS_TOAST
) => {
  if (type === ToastType.Error) {
    console.error(`Toast: ${type} - ${flattenMessage(message)}`);
  } else if (type === ToastType.Warn) {
    console.log(`Toast: ${type} - ${flattenMessage(message)}`);
  }

  const toast = document.createElement("div");
  toast.className = "toast " + type.trim().toLowerCase();
  toast.innerHTML = convertToHtmlMessage(message);

  /* FIXME for some reason changing the className's naming kind of breaks it? so I can't sass-additive-name it?? */
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
    toast.style.marginTop = `-${toast.offsetHeight / 17.777}rem`;
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      document.getElementById("toast-container")?.offsetHeight; // Reflow to ensure the transition applies correctly
    }, duration);
  }, DEFAULT_EVENT_DURATION.MS_VERTICAL_SLIDE);
};
