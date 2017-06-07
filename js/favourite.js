/**
 * Created by qyy on 2017/3/30.
 */
var photoArray;
var page=1;
window.onload = function () {
    $(function () {
        $.ajax({
            url: 'img/photos.txt',
            dataType: 'text',
            success: function (content) {
                photoArray = splitInfo(content);
                initialResult();
            }
        });
    });

    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();

    pageTurnerTrans();
};

function initialResult() {
    var myFavourite=document.getElementById("myFavourite");
    var imgArray=myFavourite.getElementsByTagName("img");
    var titleArray=myFavourite.getElementsByTagName("h1");
    var descriptionArray=myFavourite.getElementsByTagName("p");
    for(var i=0; i<imgArray.length; i++){
        imgArray[i].setAttribute("src", "img/travel-images/square-medium/"+photoArray[i+51][1]);
        titleArray[i].innerText=photoArray[i+51][2];
        if(photoArray[i+51][3]!="") {
            descriptionArray[i].innerText = photoArray[i + 51][3];
        }else{
            descriptionArray[i].innerText="none";
        }
    }
}

function pageTurnerTrans() {
    var pageTurner=document.getElementById("pageTurner");
    var pageNum=pageTurner.getElementsByTagName("a");
    resetPage();
    updatePage(page);
    for(var i=1;i<=5;i++){
        pageNum[i].onclick=function (){
            page=findPageIndex(event.srcElement);
            resetPage();
            updatePage(page);
        };
    }

    pageNum[0].onclick=function () {
        if(page>1) {
            resetPage();
            page--;
            updatePage(page);
        }
    };

    pageNum[6].onclick=function () {
        if(page<5) {
            resetPage();
            page++;
            updatePage(page);
        }
    };

    page=1;
}

function resetPage() {
    var pageTurner=document.getElementById("pageTurner");
    var pageNum=pageTurner.getElementsByTagName("a");
    for(var j=1;j<=5;j++){
        pageNum[j].style.color="indigo";
        pageNum[j].style.backgroundColor="transparent";
    }
}

function updatePage(index) {
    var pageTurner=document.getElementById("pageTurner");
    var pageNum=pageTurner.getElementsByTagName("a");
    pageNum[index].style.backgroundColor="indigo";
    pageNum[index].style.color="azure";
}

function findPageIndex(elementPage) {
    var pageTurner=document.getElementById("pageTurner");
    var pageNum=pageTurner.getElementsByTagName("a");
    for(var i=1;i<=5;i++){
        if(elementPage==pageNum[i]){
            return i;
        }
    }
}