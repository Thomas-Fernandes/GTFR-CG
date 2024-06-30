$("a").click(function() {
    $(this).next().prop("checked", true);
});