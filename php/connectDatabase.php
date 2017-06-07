<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/7
 * Time: 14:20
 */

$host="localhost:3306";
$username="root";
$password="82870808qyy";
$db=new mysqli($host, $username, $password);
if(!$db){
    die("连接有误！");
}
$db->query("use pjtravel");