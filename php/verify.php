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

$rsUser=$db->query("select Pass, UID from traveluser where UserName='{$email}'");
$rowPass=$rsUser->fetch_assoc();
if(isset($rowPass['Pass']) && $password===$rowPass['Pass']){
    echo $rowPass['UID'];
}else{
    echo "NOT PASS";
}