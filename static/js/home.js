// define URL as the default URL when the user arrives on the page
$(document).ready(function() {
    if (!window.location.href.endsWith("/home")) {
        window.location.href = "/home";
        return;
    }
    const genius_token = document.getElementById("genius-token").innerHTML;
    if (!genius_token) {
        sendToast(
            "Genius API token not found.\n"
                + "Lyrics fetch is disabled.",
            ResponseStatus.ERROR, 10
        );
        sendToast(
            "Add your Genius API token to .env\n"
                + "and restart the application to\n"
                + "enable lyrics fetch.",
            ResponseStatus.WARN, 20
        );
    } else {
        sendToast(
            "Welcome to GTFR-CG!\n"
                + "Application started successfully.",
            ResponseStatus.SUCCESS
        );
    }
});