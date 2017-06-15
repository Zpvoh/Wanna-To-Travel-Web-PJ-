/**
 * Created by qyy on 2017/3/30.
 */
var page=1;
var totalPageNum=1;
var singlePageNum=5;
var favouriteXhr=new XMLHttpRequest();
var deleteXhr=new XMLHttpRequest();
window.onload = function () {
    initialFavourite();
    favouriteDisplay();
    initialImgHref();

    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();

    pageTurnerTrans();
};

function initialFavourite() {
    var favourite=document.getElementById("favourite");

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

        favourite.appendChild(imgDiv);
    }



}

function initialPageTurner() {
    if(totalPageNum<=5){
        changePagination(1, totalPageNum);
    }else{
        changePagination(1,5);
    }
}

function sendFavouriteRequest(uid, start, num) {
    favouriteXhr.open("get", "php/getFavouritePics.php?"+bindDemands(changeDemand("uid", uid), changeDemand("start", start), changeDemand("num", num)), true);
    favouriteXhr.send(null);
}

function sendDeleteRequest(uid, imageID) {
    deleteXhr.open("get", "php/changeFavor.php?type=delete&"+bindDemands(changeDemand("uid", uid), changeDemand("ImageID", imageID)), true);
    deleteXhr.send(null);
}

function favouriteDisplay() {

    var start=(page-1)*singlePageNum;
    var num=singlePageNum;

    sendFavouriteRequest(uid, start, num);

    favouriteXhr.onload=function () {
        var favouriteDiv=document.getElementById("favourite");
        var imgDiv=favouriteDiv.querySelectorAll(".imgDiv");
        var img=favouriteDiv.getElementsByTagName("img");
        var title=favouriteDiv.getElementsByTagName("h1");
        var description=favouriteDiv.getElementsByTagName("p");
        var info=JSON.parse(favouriteXhr.responseText.split("&")[0]);
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

        var picTotalNum = favouriteXhr.responseText.split("&")[1];
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
            favouriteDisplay();
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

            favouriteDisplay();
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

            favouriteDisplay();
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