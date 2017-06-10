/**
 * Created by qyy on 2017/3/28.
 */

window.addEventListener("load", function () {
    var submit=document.getElementById("submit");
    var regForm=document.getElementById("reg");
    var email=document.getElementById("regEmailBox");
    var password=document.getElementById("regPasswordBox");
    var username=document.getElementById("regUsernameBox");
    var emailTip=document.getElementById("emailTip");
    var passwordTip=document.getElementById("passwordTip");
    var usernameTip=document.getElementById("usernameTip");

    email.addEventListener("input", function () {
        if(!email.value.match(/^[a-z|0-9]+@([a-z0-9]+\.)+[a-z]{2,}$/i)){
            emailTip.innerText="You should input a email address!";
        }else{
            emailTip.innerText="";
        }
    });

    password.addEventListener("input", function () {
        if(password.value.length<=6){
            passwordTip.innerText="Your password is too simple (sometimes naive) !";
        }else {
            passwordTip.innerText="";
        }
    });

    username.addEventListener("input", function () {
        if(username.value.length<3){
            usernameTip.innerText="Can you give a longer username?";
        }else{
            usernameTip.innerText="";
        }
    });

    submit.addEventListener("click", function () {
        if(email.value=="" || password.value=="" || username.value=="") {
            if (email.value == "") {
                emailTip.innerText = "Need Value!";
            }

            if (password.value == "") {
                passwordTip.innerText = "Need Value!";
            }

            if (username.value == "") {
                usernameTip.innerText = "Need Value!";
            }

            return;
        }

        if(emailTip.value!="" || passwordTip!="" || usernameTip!=""){
            return;
        }

        var regXhr=new XMLHttpRequest();
        regXhr.open("post", "php/appendUser.php", true);
        regXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        regXhr.send(serialize(regForm));
        console.log(serialize(regForm));
        regXhr.addEventListener("load", function () {
            var response=regXhr.responseText;
            if(response!=="You've registered" && response!="ERROR"){
                window.location.href="../home.html";
                var login = document.getElementById("login");
                var afterLog = document.getElementById("afterLog");
                var expireTime=new Date();
                expireTime.setTime(expireTime.getTime()+7*24*3600*1000);
                login.style.display = "none";
                afterLog.style.display = "inline";
                document.cookie+="UID="+response+"; expires="+expireTime.toUTCString();
            }else{
                alert(response);
            }
        });
    });

});

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
