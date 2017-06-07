
<header>
    <form name="log" id="log"></form>
    <nav>
        <ul>
            <li><img src="../img/logo.png" id="logo" class="notPic"></li>
            <li class="chosen"><a href="../home.html">Home</a></li>
            <li><a href="../browse.html">Browse</a></li>
            <li><a href="../search.html">Search</a></li>
            <li id="account">
                <ul id="login">
                    <li><input type="email" id="emailBox" class="navtext" form="log" size="20" placeholder="E-mail" required></li>
                    <li><input type="password" id="passwordBox" class="navtext" form="log" placeholder="Password" required></li>
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