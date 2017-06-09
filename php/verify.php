<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/8
 * Time: 19:06
 */
include_once "connectDatabase.php";

$email=$_POST['email'];
$password=$_POST['password'];

$rsUID=$db->query("select UID from traveluserdetails where Email='{$email}'");
$uid=$rsUID->fetch_assoc()['UID'];
$rsUser=$db->query("select Pass from traveluser where UID='{$uid}'");
$rowPass=$rsUser->fetch_assoc();
if(isset($rowPass['Pass']) && $password===$rowPass['Pass']){
    echo $uid;
}else{
    echo "NOT PASS";
}