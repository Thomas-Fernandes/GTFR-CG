const AcceptedFileExtensions = Object.freeze([
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
                hideSpinner("artwork-generation_search-form");
                const resultsDiv = $("#results");
                resultsDiv.empty();
                if (data.results.length > 0) {
                    data.results.forEach(function(result) {
                        if (result.artistName?.length > maxTitleLength)
                            result.artistName = getTitleWithAdjustedLength(result.artistName);
                        if (result.collectionName?.length > maxTitleLength)
                            result.collectionName = getTitleWithAdjustedLength(result.collectionName);
                        const highResImageUrl = result.artworkUrl100.replace("100x100", "3000x3000"); // itunes max image size is 3000x3000
                        const img = $("<img>").attr("src", highResImageUrl).addClass("result-image").attr("alt", result.collectionName || result.trackName);
                        const imgName = $("<p>").addClass("centered bold italic").text(`${result.artistName} - ${result.collectionName.replace(" - Single", "")}`);
                        const btn = $("<button>").text("Use this image").on("click", function() {
                            $.post("/artwork-generation/use-itunes-image", { url: highResImageUrl }, function(response) {
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
                    resultsDiv.text("No results found");
                }
            },
            error: function(err) {
                sendToast(err, "Error");
            }
        });
    });
    $("#fileUpload").on("submit", function(event) {
        event.preventDefault();

        const fileHasAcceptedExtension = $("#file")[0].files.length !== 0 &&
            AcceptedFileExtensions.includes($("#file")[0].files[0].name.split(".").slice(-1)[0].toLowerCase());
        if (!fileHasAcceptedExtension) {
            hideSpinner("artwork-generation_file-upload");
            alert("Please select a valid image file");
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
                    sendToast(response.message, "Error");
                }
            },
            error: function(err) {
                hideSpinner("artwork-generation_file-upload");
                sendToast(err, "Error");
            }
        });
    });
});