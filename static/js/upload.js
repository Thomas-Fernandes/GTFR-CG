const ResponseStatus = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'error'
});

$(document).ready(function() {
    $('#iTunesSearchForm').on('submit', function(event) {
        event.preventDefault();

        const query = $('#query').val();
        const country = $('#country').val();
        const logoPosition = $('#logo-position-itunes').val();

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
                    // only get first 5 results
                    data.results.slice(0, 5).forEach(function(result) {
                        // itunes max image size is 3000x3000
                        const highResImageUrl = result.artworkUrl100.replace('100x100', '3000x3000');
                        const img = $('<img>').attr('src', highResImageUrl).attr('alt', result.collectionName || result.trackName).addClass('result-image');
                        const btn = $('<button>').text('Use this image').on('click', function() {
                            $.post('/use_itunes_image', { url: highResImageUrl, position: logoPosition }, function(response) {
                                if (response.status === ResponseStatus.SUCCESS) {
                                    window.location.href = '/process_images';
                                } else {
                                    alert('Error: ' + response.message);
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
                console.error(err);
            }
        });
    });
    $('#fileUpload').on('submit', function(event) {
        event.preventDefault();

        if ($('#file')[0].files.length === 0
            || !['image/jpeg', 'image/jpg', 'image/png'].includes($('#file')[0].files[0].type)
        ) {
            alert('Please select a valid image file');
            return;
        }

        $.ajax({
            url: '/upload_image',
            type: 'POST',
            data: new FormData($('#fileUpload')[0]),
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === ResponseStatus.SUCCESS) {
                    window.location.href = '/process_images';
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(err) {
                console.error(err);
            }
        });
    });
});