/**
 * Created by qyy on 2017/3/31.
 */
var photoArray;
window.onload=function () {

    clickFavourite();
    var _accountMenu=$('#accountMenu');
    _accountMenu.hide();
}

function clickFavourite() {
    var addFavourite=document.getElementById("addFavourite");
    var button=addFavourite.getElementsByTagName("a")[0];
    button.onclick=function () {
        button.innerText="Favourite";
    }

}