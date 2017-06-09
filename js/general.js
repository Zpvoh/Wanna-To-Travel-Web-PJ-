/**
 * Created by qyy on 2017/3/25.
 */

var isSlided = false;
var imgArray = document.getElementsByTagName("img");
var xhr = new XMLHttpRequest();

window.addEventListener("load", function () {
    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    console.log(document.cookie);
    var cookieArray=analyzeCookie(document.cookie);
    if(cookieArray['UID']!==undefined){
        login.style.display = "none";
        afterLog.style.display = "inline";
    }
});

function analyzeCookie(cookie) {
    var array=cookie.split(";");
    var keyValueArray=new Array();
    for(var keyValue of array){
        var sep=keyValue.split("=");
        keyValueArray[sep[0]]=sep[1];
    }

    return keyValueArray;
}

function changeDemand(name, value) {
    return encodeURIComponent(name) + "=" + encodeURIComponent(value);
}

function bindDemands() {
    var str = "";
    for (var index in arguments) {
        if (index != arguments.length - 1) {
            str = str + arguments[index] + "&";
        } else {
            str = str + arguments[index];
        }
    }

    return str;
}

function analyzeGetPostList(response) {
    var all = response.split("/");
    delete all[all.length - 1];
    for (var i in all) {
        all[i] = all[i].split("&");
    }
    return all;
}

function initialImgHref() {
    for (var i = 0; i < imgArray.length; i++) {
        imgArray[i].style.cursor = "pointer";
        if (!isContains(imgArray[i].className, "notPic")) {
            imgArray[i].addEventListener("click", function () {
                window.open("detail.php?ImageID=" + encodeURIComponent(this.dataset.imageid));
            }, true);

        }
    }
}

function initial() {
    var inputArray = document.getElementsByTagName("input");
    var hyperlinkArray = document.getElementsByTagName("a");
    for (var i = 0; i < inputArray.length; i++) {
        if (inputArray[i].getAttribute("type") == "button") {
            inputArray[i].style.cursor = "pointer";
        }
    }

    for (var i = 0; i < hyperlinkArray.length; i++) {
        hyperlinkArray[i].style.cursor = "pointer";
    }
}

function account() {
    var accountMenu = document.getElementById("accountMenu");
    var _accountMenu = $('#accountMenu');

    if (!isSlided) {
        accountMenu.style.display = "block";
        _accountMenu.hide();
        _accountMenu.slideDown(200);
        isSlided = true;
    } else {
        _accountMenu.slideUp(200);
        isSlided = false;
    }
}

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

function login() {
    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    var email = document.getElementById("emailBox");
    var password = document.getElementById("passwordBox");
    var emailValue = email.value;
    var passwordValue = password.value;

    xhr.open("post", "php/verify.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(bindDemands(changeDemand("email", emailValue), changeDemand("password", passwordValue)));
    xhr.onload = function () {
        var response = xhr.responseText;
        if (response != "NOT PASS") {
            var expireTime=new Date();
            expireTime.setTime(expireTime.getTime()+7*24*3600*1000);
            login.style.display = "none";
            afterLog.style.display = "inline";
            document.cookie+="UID="+response+"; expires="+expireTime.toUTCString();
        } else {
            alert("Please check your input. There is something wrong.");
        }
    };

}

function logout() {
    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    var accountMenu = document.getElementById("accountMenu");
    var _accountMenu = $('#accountMenu');
    login.style.display = "inline";
    afterLog.style.display = "none";
    _accountMenu.hide();
    accountMenu.style.display = "none";
    isSlided = false;

    var expireTime=new Date();
    expireTime.setTime(expireTime.getTime()-60000);
    document.cookie="UID=; expires="+expireTime.toUTCString();

}

function isContains(str, substr) {
    return new RegExp(substr).test(str);
}

function theTail(str) {
    var tail = "";
    var tailArray = new Array();
    for (var i = 0; i < str.toString().length; i++) {
        if (str.toString().charAt(str.toString().length - i - 1) != '/') {
            tailArray[i] = str.toString().charAt(str.toString().length - i - 1);
        } else {
            for (var j = 0; j < tailArray.length; j++) {
                tail = tail + tailArray[tailArray.length - j - 1];
            }
            return tail;
        }
    }
}


