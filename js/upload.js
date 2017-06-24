/**
 * Created by qyy on 2017/3/30.
 */

var uploadXhr=new XMLHttpRequest();
window.addEventListener("load", function () {
    uploadXhr.onload=function () {
        console.log(uploadXhr.responseText);
        if(uploadXhr.responseText=="Done"){
            location.reload(true);
            alert("Upload succeed!!：）");//警告：上传成功！
        }else{
            alert("Ohh, there is something wrong!");
        }
    };
    initialSubmit();
    initialTip();
});

function sendUploadRequest(formData) {
    uploadXhr.open("post", "php/upload.php", true);
    uploadXhr.send(formData);
}

function initialSubmit() {
    var submit=document.getElementById("submit");


    submit.addEventListener("click", function () {

        var formUpload=document.getElementById("upload");
        var formData=new FormData(formUpload);
        formData.append("uid", uid);//追加UID信息 非常厉害 吓到617、css们了

        var divs=formUpload.getElementsByTagName("div");

        var submitable=false;
        for(var i=0; i<8; i++){
            var ele=divs[i].getElementsByTagName("input")[0];

            if(ele==undefined) {
                ele = divs[i].getElementsByTagName("textarea")[0];
            }
                var tip=ele.nextSibling.nextSibling;

                if(ele.value=="" || ele.value==undefined){
                    tip.innerText="You should input "+tip.id;
                    submitable=false;
                    break;
                }else{
                    tip.innerText="";
                }

                if(i==7){
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

    for(var i=0; i<8; i++){
        var ele=divs[i].getElementsByTagName("input")[0];

        if(ele==undefined) {
            ele = divs[i].getElementsByTagName("textarea")[0];

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

