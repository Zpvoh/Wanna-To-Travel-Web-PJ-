/**
 * Created by qyy on 2017/3/26.
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
                initalFilter();
            }
        });
    });

    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();

    aclicked();
    pageTurnerTrans();
};

function initalFilter() {
    var filterStage=document.getElementById("filterStage");
    var imgArray=filterStage.getElementsByTagName("img");
    for(var i=0; i<imgArray.length; i++){
        imgArray[i].setAttribute("src", "img/travel-images/square-medium/"+photoArray[i][1]);
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

function aclicked() {
     var listStage=document.getElementById("listStage");
     var ah=listStage.getElementsByTagName("a");
     for(var i=0; i<ah.length; i++){
         ah[i].onclick=function () {
             event.srcElement.style.color="blue";
         }
     }

}

