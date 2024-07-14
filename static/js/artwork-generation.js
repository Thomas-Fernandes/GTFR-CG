const ACCEPTED_IMG_EXTENSIONS = Object.freeze([
    "jpg",
    "jpeg",
    "png"
]);

const maxTitleLength = 42;
const maxCropLength = 12;

const getTitleWithAdjustedLength = (title) => {
    title = title.slice(0, maxTitleLength - 3);

    // find the first space before the max length to cut the string there
    let end = title[title.length - 1] === " " ? title.length - 1 : title.lastIndexOf(" ", maxTitleLength);

    // if the space-determined crop is too intense, just cut the string at the max length
    end = maxTitleLength - end > maxCropLength ? title.length : end;
    return title.slice(0, end) + "...";
};

$(document).ready(function() {
    $("#iTunesSearchForm").on("submit", (event) => {
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
                hideSpinner("artwork-generation_search-form");
                const resultsDiv = $("#results");
                resultsDiv.empty();
                if (data.results.length > 0) {
                    data.results.forEach((result) => {
                        if (result.artistName?.length > maxTitleLength)
                            result.artistName = getTitleWithAdjustedLength(result.artistName);
                        if (result.collectionName?.length > maxTitleLength)
                            result.collectionName = getTitleWithAdjustedLength(result.collectionName);
                        const highResImageUrl = result.artworkUrl100.replace("100x100", "3000x3000"); // itunes max image size is 3000x3000
                        const img = $("<img>").attr("src", highResImageUrl).addClass("result-image").attr("alt", result.collectionName || result.trackName);
                        const imgName = $("<p>").addClass("centered bold italic").text(`${result.artistName} - ${result.collectionName.replace(" - Single", "")}`);
                        const btn = $("<button>").text("Use this image").on("click", () => {
                            $.post("/artwork-generation/use-itunes-image", { url: highResImageUrl }, (response) => {
                                if (response.status === ResponseStatus.SUCCESS) {
                                    window.location.href = "/processed-images";
                                } else {
                                    sendToast(response.message, "Error");
                                }
                            });
                        });
                        const resultItem = $("<div>").addClass("result-item").append(img).append(btn);
                        resultItem.append(img).append(imgName).append(btn);
                        resultsDiv.append(resultItem);
                    });
                } else {
                    sendToast("No results found.", ResponseStatus.WARN);
                }
            },
            error: (err) => {
                sendToast(err, "Error");
            }
        });
    });
    $("#fileUpload").on("submit", (event) => {
        event.preventDefault();
        const formFiles = $("#file")[0].files;

        if (formFiles.length === 0) {
            hideSpinner("artwork-generation_file-upload");
            sendToast("Please select an image file.", ResponseStatus.WARN);
        }

        const fileHasAcceptedExtension =
            ACCEPTED_IMG_EXTENSIONS.includes($("#file")[0].files[0].name.split(".").slice(-1)[0].toLowerCase());
        if (!fileHasAcceptedExtension) {
            hideSpinner("artwork-generation_file-upload");
            sendToast(
                "Please select a valid image file.\n" +
                    "Accepted file extensions: " + ACCEPTED_IMG_EXTENSIONS.join(", ") + ".",
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
            success: (response) => {
                if (response.status === ResponseStatus.SUCCESS) {
                    window.location.href = "/processed-images";
                } else {
                    sendToast(response.message, ResponseStatus.ERROR);
                }
            },
            error: (err) => {
                hideSpinner("artwork-generation_file-upload");
                sendToast(err, ResponseStatus.ERROR);
            }
        });
    });
    document.getElementById('youtubeThumbnailForm').addEventListener('submit', function (event) {
        event.preventDefault();
        showSpinner('youtube-thumbnail-submit');
    
        const url = document.getElementById('youtube_url').value;
    
        fetch('/artwork-generation/use-youtube-thumbnail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'url=' + encodeURIComponent(url)
        })
        .then(response => response.json())
        .then(data => {
            hideSpinner('youtube-thumbnail-submit');
            if (data.status === 'error') {
                alert(data.message);
            } else {
                window.location.href = '/processed-images';
            }
        })
        .catch(error => {
            hideSpinner('youtube-thumbnail-submit');
            console.error('Error:', error);
        });
    });
});