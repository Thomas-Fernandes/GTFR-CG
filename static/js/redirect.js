SECONDS_TO_REDIRECT = 5;
// wait ^ seconds before redirecting to the home page

$(document).ready(function() {
    setTimeout(function() {
        if (!window.location.href.endsWith("/home"))
            window.location.href = "/home";
    }, SECONDS_TO_REDIRECT * 1000);
});