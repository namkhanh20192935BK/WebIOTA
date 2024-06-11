$(document).ready(function () {
    // Function to handle the image file
    function handleFile(file) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            var base64Image = e.target.result;
            $("#image-display").attr("src", base64Image).show();
        };

        reader.readAsDataURL(file);
    }

    // Event handler for file input change
    $(document).on("change", "#file-upload", function () {
        var file = this.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Drag and drop area
    var fileDrag = document.getElementById("file-drag");

    // Prevent default drag behaviors
    fileDrag.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(fileDrag).addClass("hover");
    });

    fileDrag.addEventListener("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(fileDrag).removeClass("hover");
    });

    fileDrag.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(fileDrag).removeClass("hover");

        var files = e.dataTransfer.files;
        if (files.length) {
            handleFile(files[0]);
        }
    });
});
