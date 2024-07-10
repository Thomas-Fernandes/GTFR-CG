SECONDS_TO_REDIRECT = 5;
// wait ^ seconds before redirecting to the home page

$(document).ready(function() {
    const countdownElement = document.getElementById("countdown");
    const pluralElement = document.getElementById("plural");
    const redirectPath = document.getElementById("direction").textContent;
    console.log(redirectPath);

    const countdownInterval = setInterval(() => {
        SECONDS_TO_REDIRECT--;
        countdownElement.textContent = SECONDS_TO_REDIRECT;
        pluralElement.textContent = SECONDS_TO_REDIRECT < 2 ? "" : "s";

        if (SECONDS_TO_REDIRECT <= 0) {
            clearInterval(countdownInterval);
            window.location.href = redirectPath;
        }
    }, 1000);
});