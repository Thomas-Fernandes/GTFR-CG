const ResponseStatus = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'error'
});
const AcceptedFileExtensions = Object.freeze(
    ['jpg', 'jpeg', 'png']
);

const sendToast = (message, type = undefined) => {
    if (type)
        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    switch (type) {
        case 'Success':
            console.log(type + ': ' + message); break;
        case 'Error':
            console.error(type + ': ' + message); break;
        default:
            console.log(message);
            break;
    }
    alert(message);
};

$(document).ready(function() {
    $('#iTunesSearchForm').on('submit', function(event) {
        event.preventDefault();

        const query = $('#query').val();
        const country = $('#country').val();

        $.ajax({
            url: 'https://itunes.apple.com/search',
            data: {
                term: query,
                entity: 'album', // album by default, but can be 'song', 'movie', 'tv-show'...
                country: country,
                limit: 10
            },
            dataType: 'jsonp',
            success: function(data) {
                const resultsDiv = $('#results');
                resultsDiv.empty();
                if (data.results.length > 0) {
                    // get first 5 results out of the 10 pulled
                    data.results.slice(0, 5).forEach(function(result) {
                        // itunes max image size is 3000x3000
                        const highResImageUrl = result.artworkUrl100.replace('100x100', '3000x3000');
                        const img = $('<img>').attr('src', highResImageUrl).attr('alt', result.collectionName || result.trackName).addClass('result-image');
                        const btn = $('<button>').text('Use this image').on('click', function() {
                            $.post('/use_itunes_image', { url: highResImageUrl }, function(response) {
                                if (response.status === ResponseStatus.SUCCESS) {
                                    window.location.href = '/processed_images';
                                } else {
                                    sendToast(response.message, 'Error');
                                }
                            });
                        });
                        const resultItem = $('<div>').addClass('result-item').append(img).append(btn);
                        resultsDiv.append(resultItem);
                    });
                } else {
                    resultsDiv.text('No results found');
                }
            },
            error: function(err) {
                sendToast(err, 'Error');
            }
        });
    });
    $('#fileUpload').on('submit', function(event) {
        event.preventDefault();

        const fileHasAcceptedExtension = $('#file')[0].files.length !== 0 &&
            AcceptedFileExtensions.includes($('#file')[0].files[0].name.split(".").slice(-1)[0].toLowerCase());
        if (!fileHasAcceptedExtension) {
            alert('Please select a valid image file');
            return;
        }

        $.ajax({
            url: '/artwork-generation',
            type: 'POST',
            data: new FormData($('#fileUpload')[0]),
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === ResponseStatus.SUCCESS) {
                    window.location.href = '/processed_images';
                } else {
                    sendToast(response.message, 'Error');
                }
            },
            error: function(err) {
                sendToast(err, 'Error');
            }
        });
    });
});