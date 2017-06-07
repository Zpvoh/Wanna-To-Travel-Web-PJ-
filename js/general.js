/**
 * Created by qyy on 2017/3/25.
 */

var isSlided=false;
var imgArray=document.getElementsByTagName("img");
var xhr=new XMLHttpRequest();

function splitInfo(data) {
    var infoArray = new Array;
    var eachLine = data.split('\n');
    for (var i = 0; i < eachLine.length; i++) {
        var currentLine = eachLine[i];
        infoArray[i] = currentLine.split(';');
    }

    initial();
    initialImgHref();

    return infoArray;
}

function analyzeFindSomePics(response) {
    var all=response.split("/;");
    delete all[all.length-1];
    for(var i in all){
        all[i]=all[i].split("/,");
        delete all[i][all[i].length-1];
        for(var j in all[i]){
            all[i][j]=all[i][j].split("//");
            delete all[i][j][all[i][j].length-1];
            for(var p in all[i][j]){
                all[i][j][p]=all[i][j][p].split("/&");
                delete all[i][j][p][all[i][j][p].length-1];
            }
        }
    }

    return all;
}

function analyzeGetPostList(response) {
    var all=response.split("/");
    delete all[all.length-1];
    for(var i in all){
        all[i]=all[i].split("&");
    }
    return all;
}

function account() {
    var accountMenu = document.getElementById("accountMenu");
    var _accountMenu=$('#accountMenu');

    if (!isSlided) {
        accountMenu.style.display = "block";
        _accountMenu.hide();
        _accountMenu.slideDown(200);
        isSlided=true;
    } else {
        _accountMenu.slideUp(200);
        isSlided=false;
    }
}

function login() {
    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    var email=document.getElementById("emailBox");
    var password=document.getElementById("passwordBox");
    var emailValue=email.value;
    var passwordValue=password.value;
        login.style.display = "none";
        afterLog.style.display = "inline";

}

function logout() {
    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    var accountMenu = document.getElementById("accountMenu");
    var _accountMenu=$('#accountMenu');
    login.style.display = "inline";
    afterLog.style.display = "none";
    _accountMenu.hide();
    accountMenu.style.display="none";
    isSlided=false

}

function isContains(str, substr) {
    return new RegExp(substr).test(str);
}

function theTail(str) {
    var tail="";
    var tailArray=new Array();
    for(var i=0;i<str.toString().length;i++){
        if(str.toString().charAt(str.toString().length-i-1)!='/'){
            tailArray[i]=str.toString().charAt(str.toString().length-i-1);
        }else{
            for(var j=0; j<tailArray.length;j++){
                tail=tail+tailArray[tailArray.length-j-1];
            }
            return tail;
        }
    }
}

function initialImgHref() {
    for(var i=0;i<imgArray.length;i++){
        imgArray[i].style.cursor="pointer";
        if(!isContains(imgArray[i].className, "notPic")) {
            imgArray[i].addEventListener("click", function () {
                window.open("detail.php?ImageID="+encodeURIComponent(this.dataset.imageid));
            }, true);

        }
    }
}

function initial() {
    var inputArray=document.getElementsByTagName("input");
    var hyperlinkArray=document.getElementsByTagName("a");
    for(var i=0; i<inputArray.length; i++){
        if(inputArray[i].getAttribute("type")=="button"){
            inputArray[i].style.cursor="pointer";
        }
    }

    for(var i=0; i<hyperlinkArray.length; i++){
        hyperlinkArray[i].style.cursor="pointer";
    }
}


