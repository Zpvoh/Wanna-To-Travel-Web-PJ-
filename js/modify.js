/**
 * Created by qyy on 2017/3/30.
 */

var imageId=decodeURIComponent(window.location.href.split("=")[1].split("#")[0]);
var imageXhr=new XMLHttpRequest();
var uploadXhr=new XMLHttpRequest();
window.addEventListener("load", function () {
    initial();
    initialSubmit();
});

function initial() {
    console.log(imageId);
    sendImageRequest();
    imageXhr.onload=function () {
        console.log(imageXhr.responseText);
       var info=imageXhr.responseText.split("&");
       var img=document.getElementById("photo");
       var name=document.getElementById("photoNameBox");
       var description=document.getElementsByName("description")[0];
       var city=document.getElementsByName("city")[0];
       var country=document.getElementsByName("country")[0];
       var continent=document.getElementsByName("continent")[0];
       var latitude=document.getElementsByName("latitude")[0];
       var longitude=document.getElementsByName("longitude")[0];

       img.src="img/travel-images/large/"+info[0];
       name.value=info[2];
       description.value=info[1];
       city.value=info[7];
       country.value=info[6];
       latitude.value=info[3];
       longitude.value=info[4];

    };
}

function sendImageRequest() {
    imageXhr.open("get","php/findThePic.php?"+changeDemand("ImageID", imageId), true);
    imageXhr.send(null);
}

function sendUploadRequest(formData) {
    uploadXhr.open("post", "php/modify.php", true);
    uploadXhr.send(formData);
}

function initialSubmit() {
    var submit=document.getElementById("submit");
    var formUpload=document.getElementById("upload");

    submit.addEventListener("click", function () {
        var formData=new FormData(formUpload);
        formData.append("uid", uid);
        formData.append("ImageID", imageId);

        sendUploadRequest(formData);
        uploadXhr.onload=function () {
            console.log(uploadXhr.responseText);
            if(uploadXhr.responseText=="Done"){
                location.reload(true);
                alert("Modify success!");
            }else{
                alert("Ohh, there is something wrong!");
            }
        };
    },true);
}
