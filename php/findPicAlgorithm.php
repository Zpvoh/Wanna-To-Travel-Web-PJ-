<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/7
 * Time: 14:40
 */

include_once "connectDatabase.php";

$rs=$db->query("select Path, ImageContent from travelimage where ImageID={$_GET["ImageID"]}");
$row=$rs->fetch_assoc();
$rsDetail=$db->query("select Description, Title from travelimagedetails where ImageID={$_GET["ImageID"]}");
$rowDetail=$rsDetail->fetch_assoc();

$path=$row["Path"];
$description=$rowDetail["Description"];
$title=$rowDetail["Title"];