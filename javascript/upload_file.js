var blob;

// Hàm chuyển đổi base64 sang Blob
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

document.getElementById('detect_auto').addEventListener('click', async (event) => {
  event.preventDefault();

  // Kiểm tra biến blob có tồn tại và hợp lệ
  if (typeof blob === 'undefined' || blob === null) {
    alert('Vui lòng chọn một hình ảnh trước khi thực hiện!');
    return;
  }

  const formData = new FormData();
  formData.append('image', blob);

  try {
    const response = await fetch('http://127.0.0.1:5000/api/detect', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Kiểm tra phản hồi từ API
    const data = await response.json();
    console.log(data); // Kiểm tra dữ liệu phản hồi

    // Xử lý JSON nếu nó là một chuỗi không hợp lệ
    if (typeof data.detections === 'string') {
      // Thay thế ký tự ' thành " để chuỗi JSON hợp lệ
      const jsonString = data.detections.replace(/'/g, '"');
      console.log(jsonString); // Kiểm tra chuỗi JSON

      // Chuyển đổi chuỗi JSON thành mảng đối tượng JavaScript
      const detections = JSON.parse(jsonString);
      console.log(detections); // Kiểm tra đối tượng JSON

      const resultInfo = document.getElementById('result_info');
      resultInfo.innerHTML = ''; // Xóa tất cả các nội dung cũ

      // Thêm thẻ <h3> với nội dung "Thông tin khối u"
      const newHeading = document.createElement('h3');
      newHeading.textContent = 'Thông tin khối u';
      resultInfo.appendChild(newHeading);

      // In ra từng phần tử trong mảng detections
      detections.forEach(detection => {
        const newDiv = document.createElement('div');
        newDiv.style.backgroundColor = '#FFFF';
        newDiv.style.padding = '10px';
        newDiv.style.margin = '10px 0 0 0';
    
        const coordinateP = document.createElement('p');
        coordinateP.innerHTML = `<b>Tọa độ phát hiện:</b> [${detection.box.join(', ')}]`;
        newDiv.appendChild(coordinateP);
    
        const classP = document.createElement('p');
        classP.innerHTML = `<b>Thuộc lớp:</b> ${detection.cls}`;
        newDiv.appendChild(classP);
    
        const confidenceP = document.createElement('p');
        confidenceP.innerHTML = `<b>Độ chính xác dự đoán:</b> ${detection.conf.toFixed(2)}`;
        newDiv.appendChild(confidenceP);
    
        const resultInfo = document.getElementById('result_info');
        resultInfo.appendChild(newDiv);
      });
    } else {
      alert('Dữ liệu JSON không hợp lệ.');
    }

    // Giải mã hình ảnh base64 và tạo URL để hiển thị
    const base64Image = data.image;
    const imageBlob = base64ToBlob(base64Image, 'image/png');
    const imgUrl = URL.createObjectURL(imageBlob);

    document.getElementById('result_info').style.display = "block";
    document.getElementById('result').style.display = "block";
    document.getElementById('convertedImage').src = imgUrl;

    const resultDiv = document.getElementById('result_info');
    // Set TimeOut để đảm bảo phần tử đã được thêm vào DOM rồi mới cuộn xuống
    setTimeout(() => {
      resultDiv.scrollIntoView({ behavior: 'smooth' });
    }, 100);

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to upload and convert image.');
  }
});

function ekUpload() {
  function Init() {
    console.log("Upload Initialised");

    var fileSelect = document.getElementById('file-upload'),
        fileDrag = document.getElementById('file-drag'),
        submitButton = document.getElementById('submit-button');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    // Is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      // File Drop
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
    // Fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // Cancel event and hover styling
    fileDragHover(e);

    // Process all File objects
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
      // Do not upload file here as we want to handle it on button click
      // uploadFile(f);
    }
  }

  // Output
  function output(msg) {
    // Response
    var m = document.getElementById('messages');
    m.innerHTML = msg;
  }

  function parseFile(file) {
    console.log(file.name);
    output('<strong>' + encodeURI(file.name) + '</strong>');

    var fileType = file.type;
    console.log(fileType);
    var imageName = file.name;

    var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
    if (isGood) {
      console.log("Tệp hợp lệ: " + file.name);
      document.getElementById('start').classList.add("hidden");
      document.getElementById('response').classList.remove("hidden");
      document.getElementById('notimage').classList.add("hidden");

      // Thumbnail Preview
      document.getElementById('file-image').classList.remove("hidden");
      document.getElementById('file-image').src = URL.createObjectURL(file);
      document.getElementById('button-del-search').classList.remove("hidden");
      document.querySelector('.uploader label').style.padding = '2rem 1.5rem';

      var fileReader = new FileReader();
      fileReader.onloadend = function() {
        blob = new Blob([fileReader.result]);
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      document.getElementById('file-image').classList.add("hidden");
      document.getElementById('notimage').classList.remove("hidden");
      document.getElementById('start').classList.remove("hidden");
      document.getElementById('response').classList.add("hidden");
      document.getElementById("file-upload-form").reset();
    }
  }

  function setProgressMaxValue(e) {
    var pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.max = e.total;
    }
  }

  function updateFileProgress(e) {
    var pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.value = e.loaded;
    }
  }

  function uploadFile(file) {
    // This function is now redundant as the file upload is handled on button click
  }

  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    // document.getElementById('file-drag').style.display = 'none';
  }
}

ekUpload();
