const AcceptedFileExtensions = Object.freeze([
    "jpg",
    "jpeg",
    "png"
]);

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
