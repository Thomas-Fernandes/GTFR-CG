// define URL as the default URL when the user arrives on the page
$(document).ready(function() {
    if (!window.location.href.endsWith("/home"))
        window.location.href = "/home";
});