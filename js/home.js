/**
 * Created by qyy on 2017/3/25.
 */
var slideXhr=new XMLHttpRequest();
var recommendXhr=new XMLHttpRequest();
var uploadXhr=new XMLHttpRequest();
var index = 2;
var recommendIndex=0;
window.addEventListener("load", function () {
    slideSendRequest(index);
    initialPics();
    recommendPicDisplay();
    uploadPicDisplay();
    recommendClick();
    uploadClick();
    var leftArrow=document.getElementById("left");
    leftArrow.addEventListener("click", onLeft, false);
    slideXhr.addEventListener("load", function () {
        var picInfo = JSON.parse(slideXhr.responseText);
        console.log(picInfo);
        var id=picInfo[0].id;
        var path = picInfo[0].path;
        var title = picInfo[0].title;
        updateSlidePage(id, path, title);
    });

    clickChoosePage();
    initialImgHref();


});

function slideSendRequest(start) {
    slideXhr.open("get", "php/getRatingList.php?"+bindDemands(changeDemand("start", start), changeDemand("num", 1)), true);
    slideXhr.send(null);
}

function recommendSendRequest(start, num) {
    recommendXhr.open("get", "php/getRatingList.php?"+bindDemands(changeDemand("start", start), changeDemand("num", num)), true);
    recommendXhr.send(null);
}

function uploadSendRequest(num) {
    uploadXhr.open("get", "php/getPostList.php?"+changeDemand("Number", num), true);
    uploadXhr.send(null);
}


function onLeft() {
    if (index != 2) {
        index++;
    } else {
        index = 0;
    }
    slideSendRequest(index);
}

function onRight() {
    if (index != 0) {
        index--;
    } else {
        index = 2;
    }
    slideSendRequest(index);
}

function updateSlidePage(id, path, title) {
    var display = document.getElementById("display");
    var showDescription=document.getElementById("showDescription");
    var _display=$('#display');
    var choose=document.getElementById("choose");
    var pagesArray=choose.getElementsByTagName("img");
    switch(index){
        case 2:
            pagesArray[0].setAttribute("src", "img/checked.gif");
            pagesArray[1].setAttribute("src", "img/unchecked.gif");
            pagesArray[2].setAttribute("src", "img/unchecked.gif");
            break;
        case 1:
            pagesArray[0].setAttribute("src", "img/unchecked.gif");
            pagesArray[1].setAttribute("src", "img/checked.gif");
            pagesArray[2].setAttribute("src", "img/unchecked.gif");
            break;
        case 0:
            pagesArray[0].setAttribute("src", "img/unchecked.gif");
            pagesArray[1].setAttribute("src", "img/unchecked.gif");
            pagesArray[2].setAttribute("src", "img/checked.gif");
            break;
    }
    display.setAttribute("src", "img/travel-images/large/" + path);
    display.dataset.imageid=id;
    _display.fadeOut(500);
    _display.fadeIn(500);
    showDescription.innerText=title;
}

function clickChoosePage() {
    var choose=document.getElementById("choose");
    var pagesArray=choose.getElementsByTagName("img");
    for(var i=0; i<pagesArray.length; i++){
        pagesArray[i].onclick=function () {
            index=2-findIndexInArray(this, pagesArray);
            slideSendRequest(index);
        }
    }
}

function findIndexInArray(element, array) {
    for(var i=0; i<array.length; i++){
        if(element==array[i]){
            return i;
        }
    }

    return null;
}

function recommendPicInitial(recommendDivNum) {
    var recommendImages=document.getElementById("recommendImages");
    var recommendDiv=recommendImages.getElementsByTagName("div")[recommendDivNum];
    var figure=document.createElement("figure");
    var img=document.createElement("img");
    var titleElement=document.createElement("figcaption");
    var descriptionElement=document.createElement("p");
    var viewdetail=document.createElement("p");

    viewdetail.innerHTML="<a>View details ▽</a>";

    figure.appendChild(img);
    figure.appendChild(titleElement);
    figure.appendChild(descriptionElement);
    figure.appendChild(viewdetail);
    recommendDiv.appendChild(figure);
}

function uploadPicInitial(uploadParagraphNum) {
    var uploadStage=document.getElementById("uploadStage");
    var uploadParagraph=uploadStage.getElementsByTagName("div")[0].getElementsByTagName("p")[uploadParagraphNum];
    for(var i=0; i<10; i++){
        var img=document.createElement("img");
        uploadParagraph.appendChild(img);
    }
}

function recommendPicDisplay() {
    var recommendRefresh=document.getElementById("recommendRefresh");
    var recommendStage=document.getElementById("recommendStage");
    var recommendPics=recommendStage.getElementsByTagName("figure");
    recommendSendRequest(recommendIndex*6+3, 6);
    recommendXhr.addEventListener("load", function () {
        var imageArray=JSON.parse(recommendXhr.responseText);
        console.log(imageArray);
        for(var i=0; i<recommendPics.length; i++){
            var id=imageArray[i]['id'];
            var path=imageArray[i]['path'];
            var title=imageArray[i]['title'];
            var description=imageArray[i]['description'];
            var img=recommendPics[i].getElementsByTagName("img")[0];
            var titleElement=recommendPics[i].getElementsByTagName("figcaption")[0];
            var descriptionElement=recommendPics[i].getElementsByTagName("p")[0];
            img.dataset.imageid=id;
            recommendPics[i].getElementsByTagName("a")[0].href="detail.html?ImageID="+id;
            img.src='img/travel-images/square-medium/'+path;
            titleElement.innerText=title;
            descriptionElement.innerText=description;

        }
    });
}

function uploadPicDisplay() {
    uploadSendRequest(20);
    uploadXhr.addEventListener("load", function () {
        var imageArray=analyzeGetPostList(uploadXhr.responseText);
        console.log(imageArray);
        var uploadPics=document.getElementById("uploadStage").getElementsByTagName("div")[0].getElementsByTagName("img");
        for(var i in uploadPics) {
            if (typeof imageArray[i] == "object") {
                var id = imageArray[i][0];
                var path = imageArray[i][1];
                if (id !== undefined && path !== undefined) {
                    uploadPics[i].src = "img/travel-images/square-small/" + path;
                    uploadPics[i].dataset.imageid = id;
                }
            }
        }
    });
}

function initialPics() {
    for(var j=0; j<2; j++) {
        for (var i = 0; i < 3; i++) {
            recommendPicInitial(j);
        }
    }

    for(var i=0; i<2; i++){
        uploadPicInitial(i);
    }
}

function recommendClick() {
    var recommendRefresh=document.getElementById("recommendRefresh");
    recommendRefresh.style.cursor="pointer";

    recommendRefresh.onclick=function () {
        if(recommendIndex==2){
            recommendIndex=0;
        }else{
            recommendIndex++;
        }
        recommendPicDisplay();
    }
}

function uploadClick() {
    var newUpload=document.getElementById("newUpload");
    newUpload.style.cursor="pointer";

    newUpload.addEventListener("click", function () {
        uploadPicDisplay();
    }, true);
}




