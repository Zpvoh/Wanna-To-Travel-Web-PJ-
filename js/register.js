/**
 * Created by qyy on 2017/3/28.
 */

window.addEventListener("load", function () {
    var submit=document.getElementById("submit");
    var regForm=document.getElementById("reg");

    submit.addEventListener("click", function () {
        var regXhr=new XMLHttpRequest();
        regXhr.open("post", "php/appendUser.php", true);
        regXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        regXhr.send(serialize(regForm));
        console.log(serialize(regForm));
        regXhr.addEventListener("load", function () {
            var response=regXhr.responseText;
            if(response!=="You've registered"){
                window.location.href="home.php";
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
