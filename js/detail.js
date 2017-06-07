/**
 * Created by qyy on 2017/3/31.
 */
var photoArray;
window.onload=function () {
    $(function () {
        $.ajax({
            url: 'img/photos.txt',
            dataType: 'text',
            success: function (content) {
                photoArray = splitInfo(content);
                initalDetails()
            }
        });
    });

    clickFavourite();
    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();
}

function findPicByFileName(filename) {
    for(var i=0; i<photoArray.length; i++){
        if(photoArray[i][1]==filename){
            return photoArray[i];
        }
    }
}

function initalDetails() {
    var pic=document.getElementById("pic");
    var h1=document.getElementsByTagName("h1")[0];
    var h2=document.getElementsByTagName("h2")[0];
    var details=document.getElementById("details");
    var detailps=details.getElementsByTagName("p");
    var description=document.getElementById("description");
    var newsrc=window.opener.document.getElementsByTagName("body")[0].getAttribute("name");
    var thePic=findPicByFileName(newsrc);
    pic.setAttribute("src", "img/travel-images/medium/"+newsrc);
    h1.innerText=thePic[2];
    h2.innerText="by "+thePic[8];
    detailps[0].innerText="Country:"+thePic[7];
    detailps[1].innerText="City:Pisa";
    detailps[2].innerText="Latitude:"+thePic[4];
    detailps[3].innerText="Longitude:"+thePic[5];
    description.innerText=thePic[3];
}

function clickFavourite() {
    var addFavourite=document.getElementById("addFavourite");
    var button=addFavourite.getElementsByTagName("a")[0];
    button.onclick=function () {
        button.innerText="Favourite";
    }

}