const ACCEPTED_FILE_EXTENSIONS = Object.freeze([
    "jpg",
    "jpeg",
    "png"
]);

$(document).ready(function() {
    $("#iTunesSearchForm").on("submit", function(event) {
        event.preventDefault();

        const query = $("#query").val();
        const country = $("#country").val();

        $.ajax({
            url: "https://itunes.apple.com/search",
            data: {
                term: query,
                entity: "album", // album by default, but can be "song", "movie", "tv-show"...
                country: country,
                limit: 6
            },
            dataType: "jsonp",
            success: function(data) {
                const resultsDiv = $("#results");
                resultsDiv.empty();
                if (data.results.length > 0) {
                    data.results.forEach(function(result) {
                        const highResImageUrl = result.artworkUrl100.replace("100x100", "3000x3000"); // itunes max image size is 3000x3000
                        const img = $("<img>").attr("src", highResImageUrl).addClass("result-image").attr("alt", result.collectionName || result.trackName);
                        const imgName = $("<p>").addClass("centered bold italic").text(`${result.artistName} - ${result.collectionName.replace(" - Single", "")}`);
                        const btn = $("<button>").text("Use this image").on("click", function() {
                            $.post("/artwork-generation/use-itunes-image", { url: highResImageUrl }, function(response) {
                                if (response.status === ResponseStatus.SUCCESS) {
                                    window.location.href = "/processed-images";
                                } else {
                                    sendToast(response.message, ResponseStatus.ERROR);
                                }
                            });
                        });
                        const resultItem = $("<div>").addClass("result-item").append(img).append(btn);
                        resultItem.append(img).append(imgName).append(btn);
                        resultsDiv.append(resultItem);
                    });
                } else {
                    sendToast("No results found", ResponseStatus.WARN);
                }
            },
            error: function(err) {
                sendToast("Service unreachable. Try again.", ResponseStatus.ERROR);
            }
        })
    });
    $("#fileUpload").on("submit", function(event) {
        event.preventDefault();

        if ($("#file")[0].files.length === 0) {
            sendToast("Please select an image file.", ResponseStatus.WARN);
        }

        const fileHasAcceptedExtension =
            ACCEPTED_FILE_EXTENSIONS.includes($("#file")[0].files[0].name.split(".").slice(-1)[0].toLowerCase());
        if (!fileHasAcceptedExtension) {
            sendToast(
                "Please select a valid image file.\n" +
                    "Accepted file extensions: " + ACCEPTED_FILE_EXTENSIONS.join(", "),
                ResponseStatus.ERROR
            );
            return;
        }

        $.ajax({
            url: "/artwork-generation/use-local-image",
            type: "POST",
            data: new FormData($("#fileUpload")[0]),
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === ResponseStatus.SUCCESS) {
                    window.location.href = "/processed-images";
                } else {
                    sendToast(response.message, ResponseStatus.ERROR);
                }
            },
            error: function(err) {
                sendToast(err, ResponseStatus.ERROR);
            }
        });
    });
});