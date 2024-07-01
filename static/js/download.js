// allow user to click on the image to select it for download
$("a").click(function() {
    $(this).next("input[type=radio]").prop("checked", true);
});