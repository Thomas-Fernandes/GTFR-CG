

const ResponseStatus = Object.freeze({
    SUCCESS: "success",
    WARN: "warn",
    ERROR: "error",
});

SECONDS_TOAST = 3;
MS_FADE_OUT = 500;

const sendToast = (message, type = ResponseStatus.ERROR, duration = SECONDS_TOAST) => {
    const toast = document.createElement("div");
    toast.className = "toast " + type.trim().toLowerCase();
    toast.textContent = message;

    const progressBar = document.createElement("div");
    progressBar.className = "toast-progress " + type.trim().toLowerCase();
    toast.appendChild(progressBar);

    const progressFill = document.createElement("div");
    progressFill.className = "toast-progress-fill " + type.trim().toLowerCase();
    progressBar.appendChild(progressFill);

    document.getElementById("toast-container").appendChild(toast);

    // Use setTimeout to ensure the initial styles are applied before transitioning
    setTimeout(() => {
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

const dismissToast = (toast, duration = MS_FADE_OUT) => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
        toast.remove();
    }, duration);
}
