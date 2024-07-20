SECONDS_BEFORE_REDIRECT = 5;

$(document).ready(function() {
    const countdownElement = document.getElementById("countdown");
    const pluralElement = document.getElementById("plural");
    const redirectPath = document.getElementById("direction").textContent;
    console.log(redirectPath);

    const countdownInterval = setInterval(() => {
        SECONDS_BEFORE_REDIRECT -= 1;
        countdownElement.textContent = SECONDS_BEFORE_REDIRECT;
        pluralElement.textContent = SECONDS_BEFORE_REDIRECT < 2 ? "" : "s";

        if (SECONDS_BEFORE_REDIRECT <= 0) {
            clearInterval(countdownInterval);
            window.location.href = redirectPath;
        }
    }, 1000);
});