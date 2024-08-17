const ErrorMsg = Object.freeze({
    LYRICS_NOT_FOUND: "Lyrics not found.",
});

$(document).ready(function() {
    const lyricsText = $("textarea").val();

    if (lyricsText === ErrorMsg.LYRICS_NOT_FOUND) {
        sendToast(ErrorMsg.LYRICS_NOT_FOUND, ResponseStatus.WARN);
        $("textarea").val("");
        $("#lyrics_save").hide();
    } else if (lyricsText && lyricsText !== "") {
        sendToast("Lyrics fetched successfully!", ResponseStatus.SUCCESS);
        $("#lyrics_save").show();
    } else {
        $("#lyrics_save").hide();
    }

    $('textarea').each(function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';

        $(this).on('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
});
