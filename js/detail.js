/**
 * Created by qyy on 2017/3/31.
 */
var xhr=new XMLHttpRequest();
var xhrFavor=new XMLHttpRequest();
var imageId=decodeURIComponent(window.location.href.split("=")[1].split("#")[0]);
window.onload=function () {
    var cookies=document.cookie.split(";");
    for(var i in cookies){
        var cookie=cookies[i].split("=");
        if(cookie[0]=="UID"){
            uid=cookie[1];
            break;
        }
    }

    sendRequest();
    clickFavourite();
    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();
};

function clickFavourite() {
    var addFavourite=document.getElementById("addFavourite");
    var button=addFavourite.getElementsByTagName("a")[0];
    var likeNum=document.getElementById("likeNum").getElementsByTagName("p")[0];
    button.style.cursor="pointer";

    button.onclick=function () {
        var cookies=document.cookie.split(";");
        for(var i in cookies){
            var cookie=cookies[i].split("=");
            if(cookie[0]=="UID"){
                uid=cookie[1];
                break;
            }
        }

        if(uid==undefined){
            alert("Please login");
        }else if(button.innerText == "Favourite") {
            xhrFavor.open("get", "php/changeFavor.php?type=delete&" + bindDemands(changeDemand("uid", uid), changeDemand("ImageID", imageId)), true);
            xhrFavor.send(null);
            xhrFavor.onload = function () {
                if (xhrFavor.responseText == "Ok") {
                    button.innerText = "Add to Favourite";
                    likeNum.innerText--;
                } else {
                    alert("There is something wrong");
                    console.log(xhrFavor.responseText);
                }
            }
        }else{
            xhrFavor.open("get", "php/changeFavor.php?type=append&" + bindDemands(changeDemand("uid", uid), changeDemand("ImageID", imageId)), true);
            xhrFavor.send(null);
            xhrFavor.onload = function () {
                if (xhrFavor.responseText == "Ok") {
                    button.innerText = "Favourite";
                    likeNum.innerText++;
                } else {
                    alert("There is something wrong");
                    console.log(xhrFavor.responseText);
                }
            }
        }
    }

}

function sendRequest() {
    xhr.open("get", "php/findThePic.php?"+bindDemands(changeDemand("ImageID", imageId), changeDemand("uid", uid)),true);
    xhr.send(null);
    xhr.onload=function () {
        var picInfo=xhr.responseText.split("&");
        console.log(picInfo);
        var title=document.getElementsByTagName("h1")[0];
        var name=document.getElementsByTagName("h2")[0];
        var pic=document.getElementById("pic");
        var details=document.getElementById("details");
        var paragraphs=details.getElementsByTagName("p");
        var country=paragraphs[0];
        var city=paragraphs[1];
        var latitude=paragraphs[2];
        var longitude=paragraphs[3];
        var description=document.getElementById("description");
        var addFavourite=document.getElementById("addFavourite");
        var button=addFavourite.getElementsByTagName("a")[0];
        var likeNum=document.getElementById("likeNum").getElementsByTagName("p")[0];

        title.innerText=picInfo[2];
        name.innerText=picInfo[5];
        pic.src="img/travel-images/large/"+picInfo[0];
        country.innerText="Country: "+picInfo[6];
        city.innerText="City: "+picInfo[7];
        latitude.innerText="Latitude: "+picInfo[3];
        longitude.innerText="Longitude: "+picInfo[4];
        description.innerText=picInfo[1];
        button.innerText=picInfo[8];
        likeNum.innerText=picInfo[9];
    };
}