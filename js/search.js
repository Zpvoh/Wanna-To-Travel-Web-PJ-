/**
 * Created by qyy on 2017/3/26.
 */
var page=1;
var singlePageNum=5;
var totalPageNum;
var type="title";
var condition="";
var filterFlag;
var searchXhr=new XMLHttpRequest();

window.addEventListener("load",function () {
    initialResult();
    initialFilterButton();
    initialImgHref();
    initialPageTurner();

    pageTurnerTrans();
});

function initialResult() {
    var result=document.getElementById("result");

    for(var i=0; i<singlePageNum; i++){
        var imgDiv=document.createElement("div");
        var img=document.createElement("img");
        var text=document.createElement("div");
        var title=document.createElement("h1");
        var description=document.createElement("p");

        text.classList.add("text");
        text.appendChild(title);
        text.appendChild(description);

        imgDiv.appendChild(img);
        imgDiv.appendChild(text);

        result.appendChild(imgDiv);
    }

    resultDisplay(type);

}

function initialFilterButton() {
    var filterBt=document.getElementById("filterButton");
    filterBt.addEventListener("click", function () {
        page=1;
        filterFlag=true;
        requestPic();
    },true);
}

function initialPageTurner() {
    if(totalPageNum<=5){
        changePagination(1, totalPageNum);
    }else{
        changePagination(1,5);
    }
}

function sendSearchRequest(condition, type, start, num) {
    searchXhr.open("get", "php/search.php?"+bindDemands(changeDemand("condition", condition), changeDemand("type", type), changeDemand("start", start), changeDemand("num", num)), true);
    searchXhr.send(null);
}

function requestPic() {
    var titleRadio=document.getElementById("titleRadio");

    if(titleRadio.checked){
        var titleBox=document.getElementById("titleBox");
        var titleInfo=titleBox.value;
        type="title";
        condition=titleInfo;
    }else{
        var descriptionBox=document.getElementById("descriptionBox");
        var descriptionInfo=descriptionBox.value;
        type="description";
        condition=descriptionInfo;
    }

    resultDisplay(type);
}

function resultDisplay(type) {

    var start=(page-1)*singlePageNum;
    var num=singlePageNum;

    sendSearchRequest(condition,type,start,num);

    searchXhr.onload=function () {

        var resultDiv=document.getElementById("result");
        var img=resultDiv.getElementsByTagName("img");
        var title=resultDiv.getElementsByTagName("h1");
        var description=resultDiv.getElementsByTagName("p");

        var response=searchXhr.responseText;
        var result=JSON.parse(response.split("&")[0]);
        console.log(result);
            for (var i = 0; i < img.length; i++) {
                img[i].src = "";
                img[i].dataset.imageid = 0;
                title[i].innerText = "";
                description[i].innerText = "";
            }

        if(result.length==0){
            alert("I can't find anything about this keyword");
            totalPageNum=1;
        }else {

            for (var i = 0; i < result.length; i++) {
                img[i].src = "img/travel-images/square-medium/" + result[i][1];
                img[i].dataset.imageid = result[i][0];
                title[i].innerText = result[i][2];
                description[i].innerText = result[i][3];
            }

            var picTotalNum = searchXhr.responseText.split("&")[1];
            totalPageNum = parseInt(picTotalNum / singlePageNum) + (picTotalNum % singlePageNum == 0 ? 0 : 1);

        }
            if (filterFlag) {
                initialPageTurner();
                filterFlag = false;
            }

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
            resultDisplay(type);
        }, true);

        pages.appendChild(pageBt);
    }

    resetPage(totalPageNum);
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

            resultDisplay(type);
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

            resultDisplay(type);
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