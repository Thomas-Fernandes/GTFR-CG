const ErrorMsg = Object.freeze({
    LYRICS_NOT_FOUND: "Lyrics not found.",
});

$(document).ready(function() {
    if ($("textarea").val() === ErrorMsg.LYRICS_NOT_FOUND) {
        sendToast(ErrorMsg.LYRICS_NOT_FOUND, ResponseStatus.WARN);
        $("textarea").val("");
    }
});