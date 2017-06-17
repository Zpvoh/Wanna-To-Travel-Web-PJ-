/**
 * Created by qyy on 2017/3/30.
 */
var page=1;
var totalPageNum=1;
var singlePageNum=5;
var uploadXhr=new XMLHttpRequest();
var deleteXhr=new XMLHttpRequest();
window.onload = function () {
    initialUpload();
    uploadDisplay();
    initialImgHref();

    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();

    pageTurnerTrans();
};

function initialUpload() {
    var upload=document.getElementById("upload");

    for(var i=0; i<singlePageNum; i++){
        var imgDiv=document.createElement("div");
        var img=document.createElement("img");
        var text=document.createElement("div");
        var title=document.createElement("h1");
        var description=document.createElement("p");
        var deleteBt=document.createElement("input");

        text.classList.add("text");
        text.appendChild(title);
        text.appendChild(description);

        deleteBt.type="button";
        deleteBt.className="delete";
        deleteBt.value="Delete";

        imgDiv.classList.add("imgDiv");
        imgDiv.appendChild(img);
        imgDiv.appendChild(text);
        imgDiv.appendChild(deleteBt);

        upload.appendChild(imgDiv);
    }



}

function initialPageTurner() {
    if(totalPageNum<=5){
        changePagination(1, totalPageNum);
    }else{
        changePagination(1,5);
    }
}

function sendUploadRequest(uid, start, num) {
    uploadXhr.open("get", "php/getUploadPics.php?"+bindDemands(changeDemand("uid", uid), changeDemand("start", start), changeDemand("num", num)), true);
    uploadXhr.send(null);
}

function sendDeleteRequest(uid, imageID) {
    deleteXhr.open("get", "php/changePhoto.php?type=delete&"+bindDemands(changeDemand("uid", uid), changeDemand("ImageID", imageID)), true);
    deleteXhr.send(null);
}

function uploadDisplay() {

    var start=(page-1)*singlePageNum;
    var num=singlePageNum;

    sendUploadRequest(uid, start, num);

    uploadXhr.onload=function () {
        var uploadDiv=document.getElementById("upload");
        var imgDiv=uploadDiv.querySelectorAll(".imgDiv");
        var img=uploadDiv.getElementsByTagName("img");
        var title=uploadDiv.getElementsByTagName("h1");
        var description=uploadDiv.getElementsByTagName("p");
        console.log(uploadXhr.responseText);
        var info=JSON.parse(uploadXhr.responseText.split("&")[0]);
        console.log(info);

        for (var i = 0; i < img.length; i++) {
            img[i].src = "";
            img[i].dataset.imageid = 0;
            title[i].innerText = "";
            description[i].innerText = "";
            if(imgDiv[i].getElementsByClassName("delete")[0]!=undefined) {
                imgDiv[i].removeChild(imgDiv[i].getElementsByClassName("delete")[0]);
            }
        }

        for(var i=0; i<info.length; i++){
            img[i].src="img/travel-images/square-medium/"+info[i][1];
            img[i].dataset.imageid=info[i][0];
            title[i].innerText=info[i][2];
            description[i].innerText=info[i][3];

            var modifyBt=document.createElement("input");
            modifyBt.type="button";
            modifyBt.value="Modify";
            modifyBt.className="modify";
            modifyBt.dataset.imageid=info[i][0];
            modifyBt.addEventListener("click", function () {
                window.open("modify.html?"+changeDemand("ImageID", this.dataset.imageid));
            },true);
            imgDiv[i].appendChild(modifyBt);

            var deleteBt=document.createElement("input");
            deleteBt.type="button";
            deleteBt.dataset.imageid=info[i][0];
            deleteBt.className="delete";
            deleteBt.value="Delete";
            deleteBt.addEventListener("click",function () {
                sendDeleteRequest(uid, this.dataset.imageid);
                deleteXhr.onload=function () {
                    if(deleteXhr.responseText=="Ok"){
                        location.reload(true);   //Need to be modified
                    }else{
                        alert("There is something wrong");   //Need to be modified
                    }
                };
            }, true);
            imgDiv[i].appendChild(deleteBt);

        }

        var picTotalNum = uploadXhr.responseText.split("&")[1];
        totalPageNum = parseInt(picTotalNum / singlePageNum) + (picTotalNum % singlePageNum == 0 ? 0 : 1);
        initialPageTurner();

    };
}

function changePagination(start, end) {
    var pages=document.getElementById("pages");

    while(pages.firstChild){
        pages.removeChild(pages.firstChild);
    }

    for(var i=start-1; i<end; i++){
        var pageBt=document.createElement("a");
        pageBt.id="page"+(i+1);
        pageBt.dataset.index=i+1;
        pageBt.style.cursor="pointer";
        pageBt.innerText=i+1;
        pageBt.addEventListener("click", function () {
            page=this.dataset.index;
            resetPage(totalPageNum);
            updatePage(page);
            uploadDisplay();
        }, true);

        pages.appendChild(pageBt);
    }

    resetPage();
    updatePage(page);
}

function pageTurnerTrans() {
    var back=document.getElementById("back");
    var forward=document.getElementById("forward");

    back.addEventListener("click", function () {
        if(page!==1){
            page--;
            if(page-5>0) {
                changePagination(page-4, page);
            }else if(page>0){
                initialPageTurner();
            }else{
                page++;
            }

            uploadDisplay();
        }
    }, true);

    forward.addEventListener("click", function () {
        if(page!==totalPageNum){
            page++;
            if(page+5<=totalPageNum){
                changePagination(page,page+4);
            }else{
                if (totalPageNum <= 5) {
                    changePagination(1, totalPageNum);
                } else {
                    changePagination(totalPageNum - 4, totalPageNum);
                }
            }

            uploadDisplay();
        }
    }, true);
}

function resetPage() {
    var pages=document.getElementById("pages").getElementsByTagName("a");

    for(var j=0;j<pages.length;j++){
        pages[j].style.color="indigo";
        pages[j].style.backgroundColor="transparent";
    }
}

function updatePage(index) {
    var pageChoose=document.getElementById("page"+index);

    pageChoose.style.backgroundColor="indigo";
    pageChoose.style.color="azure";
}