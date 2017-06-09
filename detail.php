<?php
include_once("php/findPicAlgorithm.php")
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="img/icon.gif">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/head.css">
    <link rel="stylesheet" href="css/general.css">
    <link rel="stylesheet" href="css/detail.css">
    <script src="js/jquery-3.2.0.js"></script>
    <script src="js/general.js"></script>
    <script src="js/detail.js"></script>
    <title>Wanna To Travel</title>
</head>
<body>
<?php
    include_once "php/header.php";
?>
<article>
    <section>
        <div id="title">
            <h1><?php echo $title ?></h1>
            <h2><?php echo $name ?></h2>
        </div>
        <div id="displayInfo">
        <div id="image">
            <img src="img/travel-images/large/<?php echo $path ?>" id="pic">
        </div>
        <div>
            <div id="addFavourite">
                <a href="#">Add to favourite</a>
            </div>
            <div id="likeNum">
                <h3 onclick="clickLike()">Like Number</h3>
                <p>99</p>
            </div>
            <div id="details">
                <h3>Image Details</h3>
                <p>Country:<?php echo $country ?></p>
                <p>City:<?php echo $city ?></p>
                <p>Latitude:<?php echo $latitude ?></p>
                <p>Longitude:<?php echo $longitude ?></p>
            </div>
        </div>
        </div>
        <div>
            <p id="description"><?php echo $description ?></p>
        </div>
    </section>
</article>
<?php
    include_once "php/footer.php";
?>

</body>
</html>