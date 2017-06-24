<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/8
 * Time: 19:06
 */
include_once "connectDatabase.php";
include_once "PasswordHash.php";

$hasher=new PasswordHash(8, false);

$email=$_POST['email'];
$password=$_POST['password'];

$rsUID=$db->query("select UID from traveluserdetails where Email='{$email}'");
$uid=$rsUID->fetch_assoc()['UID'];
$rsUser=$db->query("select Pass, UserName from traveluser where UID='{$uid}'");
$rowPass=$rsUser->fetch_assoc();
if(isset($rowPass['Pass']) && $hasher->CheckPassword($password, $rowPass["Pass"])){
    echo $uid."&";
    echo $rowPass['UserName'];
}else{
    echo "NOT PASS";
}