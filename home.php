<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="img/icon.gif">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/head.css">
    <link rel="stylesheet" href="css/general.css">
    <link rel="stylesheet" href="css/home.css">
    <script src="js/jquery-3.2.0.js"></script>

    <script src="js/general.js"></script>
    <script src="js/home.js"></script>

    <title>Wanna To Travel</title>
</head>
<body>
<?php
    include_once "php/header.php";
?>
<article>
    <section id="showStage">
        <a class="arrow" id="left"><img alt="img" class="arrow notPic" src="img/arrowleft.png"></a>
        <img alt=""img" id="display" src="" data-imageid=''>
        <div id="choose">
            <img src="img/checked.gif" class="notPic">
            <img src="img/unchecked.gif" class="notPic">
            <img src="img/unchecked.gif" class="notPic">
        </div>
        <span id="showDescription"></span>
        <a class="arrow" id="right"><img alt="img" class="arrow notPic" src="img/arrowright.png" onclick="onRight()"></a>
    </section>
    <section id="recommendStage">
        <p class="refresh"><a id="recommendRefresh">Other Hot Recommend <img src="img/refresh.png" width="15" height="15" class="notPic"></a></p>
        <div id="recommendImages">
            <div>

            </div>
            <div>

            </div>
        </div>
    </section>
    <section id="uploadStage">
        <p class="refresh"><a id="newUpload">New Upload <img src="img/refresh.png" width="15" height="15" class="notPic"></a></p>
        <div>
            <p>

            </p>
            <p>

            </p>
        </div>
    </section>

</article>
<?php
    include_once "php/footer.php";
?>

</body>
</html>