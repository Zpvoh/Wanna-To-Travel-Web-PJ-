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
<header>
    <form name="log" id="log" method="post"></form>
    <nav>
        <ul>
            <li><img src="../img/logo.png" id="logo" class="notPic"></li>
            <li><a href="../home.html">Home</a></li>
            <li><a href="../browse.html">Browse</a></li>
            <li><a href="../search.html">Search</a></li>
            <li id="account">
                <ul id="login">                    <li><input type="email" id="emailBox" class="navtext" form="log" size="20" placeholder="E-mail" required name="email"></li>
                    <li><input type="password" id="passwordBox" class="navtext" form="log" placeholder="Password" required name="password"></li>
                    <li><a class="beforeLog" onclick="login()" id="loginButton" href="#">Login</a></li>
                    <li><a class="beforeLog" href="../register.html">Register</a></li>
                </ul>
            </li>
            <li><a id="afterLog" onclick="account()" href="#">My Account▼</a></li>

        </ul>
    </nav>
    <div id="accountMenu">
        <ul>
            <li><a href="../upload.html">Upload</a></li>
            <li><a href="../myphotos.html">My Photos</a></li>
            <li><a href="../favourite.html">Favourites</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </div>
</header>
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