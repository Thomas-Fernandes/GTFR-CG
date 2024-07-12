// allow user to click on the image to select it for download
$("a").click(function() {
    $(this).next("input[type=radio]").prop("checked", true);
});

const submitDownloadThumbnail = (form) => {
    const selectedOption = document.querySelector("input[name=selected_thumbnail_idx]:checked").value;
    form.action = "/download-thumbnail/" + encodeURIComponent(selectedOption);
    form.submit();
}
