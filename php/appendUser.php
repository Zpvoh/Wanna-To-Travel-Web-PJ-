<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/9
 * Time: 16:52
 */

include_once "connectDatabase.php";
include_once "PasswordHash.php";

$hasher=new PasswordHash(8, false);

$email=$_POST["email"];
$password=$_POST["password"];
$username=$_POST["username"];

if($email=="" || $password=="" || $username=="" || strlen($password)<=6 || strlen($username)<3){
    die("ERROR");
}

if(preg_match("/^[a-z|0-9]+@([a-z0-9]+\\.)+[a-z]{2,}$/i", $email)==0){
    die("ERROR");
}

$password=$hasher->HashPassword($_POST["password"]);

$rsUID=$db->query("select UID from traveluserdetails WHERE Email='{$email}'");

if(!$rsUID->fetch_assoc()){
    $db->query("insert into traveluser".
                "(UserName, Pass, State, DateJoined, DateLastModified)".
                "VALUES".
                "('{$username}', '{$password}', 1, now(), now())");

    $rs=$db->query("select UID from traveluser ORDER by UID DESC Limit 1");
    $uid=$rs->fetch_assoc()["UID"];

    $db->query("insert into traveluserdetails".
                "(UID, Email, Privacy)".
                "VALUES".
                "({$uid},'{$email}', 1)");

    echo $uid."&".$username;
}else{
    echo "You've registered";
}
