/**
 * Created by qyy on 2017/3/30.
 */
var uploadXhr=new XMLHttpRequest();

window.addEventListener("load", function () {
    initialSubmit();
});

function sendUploadRequest(formData) {
    uploadXhr.open("post", "php/upload.php", true);
    uploadXhr.send(formData);
}

function initialSubmit() {
    var submit=document.getElementById("submit");
    var formUpload=document.getElementById("upload");

    submit.addEventListener("click", function () {
        var formData=new FormData(formUpload);
        formData.append("uid", uid);

        sendUploadRequest(formData);
        uploadXhr.onload=function () {
            console.log(uploadXhr.responseText);
            if(uploadXhr.responseText=="Done"){

            }else{

            }
        };
    },true);
}

