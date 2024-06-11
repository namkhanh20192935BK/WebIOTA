// File Upload
function ekUpload() {
  function Init() {
    console.log("Upload Initialised");

    var fileSelect = document.getElementById('file-upload'),
        fileDrag = document.getElementById('file-drag');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    // Kiểm tra nếu trình duyệt hỗ trợ XHR2
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      // Xử lý kéo thả file
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  }

  function fileDragHover(e) {
    var fileDrag = document.getElementById('file-drag');

    e.stopPropagation();
    e.preventDefault();

    fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }

  function fileSelectHandler(e) {
    // Lấy đối tượng FileList
    var files = e.target.files || e.dataTransfer.files;

    // Hủy sự kiện và kiểu hover
    fileDragHover(e);

    // Xử lý tất cả các đối tượng File
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
    }
  }

  function parseFile(file) {
    console.log(file.name);
    
    var imageName = file.name;
    var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
    if (isGood) {
      console.log("Tệp hợp lệ: " + file.name);
    } else {
      console.log("Tệp không hợp lệ: " + file.name);
    }
  }

  // Kiểm tra hỗ trợ các API của File
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    console.warn("Trình duyệt không hỗ trợ các API của File.");
  }
}

ekUpload();
