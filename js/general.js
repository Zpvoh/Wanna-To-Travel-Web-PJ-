/**
 * Created by qyy on 2017/3/25.
 */

var isSlided = false;
var imgArray = document.getElementsByTagName("img");
var xhr = new XMLHttpRequest();
var uid, username;

window.addEventListener("load", function () {

    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    console.log(document.cookie);
    var cookieArray=analyzeCookie(document.cookie);
    console.log(cookieArray);
    if(cookieArray['UID']!==undefined && cookieArray['UID']!==""){
        uid=getCookie("UID");
        username=getCookie("UserName");

        login.style.display = "none";
        afterLog.style.display = "inline";
        afterLog.innerText="Welcome, "+cookieArray[' UserName']+"▼";
    }

    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();
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

function getCookie(cookieName) {
    var cookieArray=analyzeCookie(document.cookie);
    return cookieArray[cookieName];
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
                window.open("detail.html?ImageID=" + encodeURIComponent(this.dataset.imageid));
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

function login() {
    var login = document.getElementById("login");
    var afterLog = document.getElementById("afterLog");
    var email = document.getElementById("emailBox");
    var password = document.getElementById("passwordBox");
    var emailValue = email.value;
    var passwordValue = password.value;

    if(emailValue=="" || passwordValue==""){
        alert("Need Value!");
        return;
    }

    if(!emailValue.match(/^[a-z|0-9]+@([a-z0-9]+\.)+[a-z]{2,}$/i)){
        alert("You should input an email address!");
        return;
    }

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
            afterLog.innerText="Welcome, "+response.split("&")[1]+"▼";
            document.cookie="UID="+response.split("&")[0]+";expires="+expireTime.toUTCString();
            document.cookie="UserName="+response.split("&")[1]+";expires="+expireTime.toUTCString();
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
    document.cookie="UserName=; expires="+expireTime.toUTCString();
}

function isContains(str, substr) {
    return new RegExp(substr).test(str);
}

function serialize(form){
    var parts = new Array();
    var field = null;

    for (var i=0, len=form.elements.length; i < len; i++){
        field = form.elements[i];

        switch(field.type){
            case "select-one":
            case "select-multiple":
                for (var j=0, optLen = field.options.length; j < optLen; j++){
                    var option = field.options[j];
                    if (option.selected){
                        var optValue = "";
                        if (option.hasAttribute){
                            optValue = (option.hasAttribute("value") ?
                                option.value : option.text);
                        } else {
                            optValue = (option.attributes["value"].specified ?
                                option.value : option.text);
                        }
                        parts.push(encodeURIComponent(field.name) + "=" +
                            encodeURIComponent(optValue));
                    }
                }
                break;

            case undefined:     //fieldset
            case "file":        //file input
            case "submit":      //submit button
            case "reset":       //reset button
            case "button":      //custom button
                break;

            case "radio":       //radio button
            case "checkbox":    //checkbox
                if (!field.checked){
                    break;
                }
            /* falls through */

            default:
                parts.push(encodeURIComponent(field.name) + "=" +
                    encodeURIComponent(field.value));
        }
    }
    return parts.join("&");
}


