const EventDuration = Object.freeze({
    SECONDS_TOAST: 5,
    MS_FADE_OUT: 500,
    MS_VERTICAL_SLIDE: 200,
});

const ResponseStatus = Object.freeze({
    SUCCESS: "success",
    WARN: "warn",
    ERROR: "error",
});

const convertToHtmlMessage = (message) => {
    return message.trim()
        .replace(/\r/g, "")
        .replace(/\n/g, "<br>")
        .replace(/  /g, "&nbsp;&nbsp;")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
    ;
};

const sendToast = (message, type = ResponseStatus.ERROR, duration = EventDuration.SECONDS_TOAST) => {
    const toast = document.createElement("div");
    toast.className = "toast " + type.trim().toLowerCase();
    toast.innerHTML = convertToHtmlMessage(message);

    const progressBar = document.createElement("div");
    progressBar.className = "toast-progress " + type.trim().toLowerCase();
    toast.appendChild(progressBar);

    const progressFill = document.createElement("div");
    progressFill.className = "toast-progress-fill " + type.trim().toLowerCase();
    progressBar.appendChild(progressFill);

    document.getElementById("toast-container").appendChild(toast);

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

const dismissToast = (toast, duration = EventDuration.MS_FADE_OUT) => {
    toast.style.animation = `fade-out ${EventDuration.MS_FADE_OUT.toString()}ms forwards`;
    setTimeout(() => {
        toast.style.marginTop = `-${toast.offsetHeight}px`;
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.remove();
            document.getElementById("toast-container").offsetHeight; // Reflow to ensure the transition applies correctly
        }, duration);
    }, EventDuration.MS_VERTICAL_SLIDE);
}
