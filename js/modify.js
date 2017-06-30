/**
 * Created by qyy on 2017/3/30.
 */

var imageId=decodeURIComponent(window.location.href.split("=")[1].split("#")[0]);
var imageXhr=new XMLHttpRequest();
var uploadXhr=new XMLHttpRequest();
window.addEventListener("load", function () {
    uploadXhr.onload=function () {
        console.log(uploadXhr.responseText);
        if(uploadXhr.responseText=="Done"){
            location.reload(true);
            alert("Modify success!");
        }else{
            alert(uploadXhr.responseText);
        }
    };

    initial();
    initialSubmit();

    initialTip();
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
       continent.value=info[10];

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

        var divs=formUpload.getElementsByTagName("div");

        var submitable=false;
        for(var i=2; i<9; i++){
            var ele=divs[i].getElementsByTagName("input")[0];

            if(ele==undefined) {
                ele = divs[i].getElementsByTagName("textarea")[0];
                if(ele==undefined){
                    continue;
                }
            }
            var tip=ele.nextSibling.nextSibling;

            if((ele.value=="" || ele.value==undefined)){
                tip.innerText="You should input "+tip.id;
                submitable=false;
                break;
            }else{
                tip.innerText="";
            }

            if(i==6){
                submitable=true;
            }
        }

        if(submitable) {
            sendUploadRequest(formData);
        }

    },true);
}

function initialTip() {
    var formUpload=document.getElementById("upload");
    var divs=formUpload.getElementsByTagName("div");

    for(var i=1; i<9; i++){
        var ele=divs[i].getElementsByTagName("input")[0];

        if(ele==undefined) {
            ele = divs[i].getElementsByTagName("textarea")[0];
            if(ele==undefined){
                continue;
            }
        }
        ele.addEventListener("input", function () {
            var tip=this.nextSibling.nextSibling;

            if(this.value=="" || this.value==undefined){
                tip.innerText="You should input "+tip.id;
            }else{
                tip.innerText="";
            }
        },true);
    }
}
