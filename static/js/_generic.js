const sendToast = (message, type = undefined) => {
    if (type)
        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    switch (type) {
        case "Success":
            console.log(type + ": " + message); break;
        case "Error":
            console.error(type + ": " + message); break;
        default:
            console.log(message);
            break;
    }
    alert(message);
};

const ResponseStatus = Object.freeze({
    SUCCESS: "success",
    ERROR: "error"
});

const showSpinner = (name) => {
    if (!name) {
        sendToast("HTML Spinner id is required", "Error");
        return;
    }
    if (name === "lyrics_search") {
        const hasInvalidField =
            !document.getElementById("artist")?.value
            || !document.getElementById("song")?.value;
        if (hasInvalidField)
            return; // Do not show spinner if the form is not fully filled
    }

    const button = document.getElementById(name);

    // Create spinner container if it doesn't exist
    if (!button.querySelector(".spinner-container")) {
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
    const spinnerContainer = button.querySelector(".spinner-container");
    spinnerContainer.style.display = "block";
    spinnerContainer.style.alignSelf = "center";
}
const hideSpinner = (name) => {
    const spinnerContainer = document.getElementById("spinner-container" + "-" + name);
    if (spinnerContainer) {
        spinnerContainer.style.display = "none";
    }
}