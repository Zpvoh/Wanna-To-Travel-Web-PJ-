<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/5
 * Time: 1:11
 */
include_once "connectDatabase.php";

$rs=$db->query("select * from {$_GET["Table"]} {$_GET["Condition"]} ORDER by ImageRatingID DESC ");
$all=array();
$index=0;
while($row=$rs->fetch_assoc()){
    $id=$row["ImageID"];
    $rsImage=$db->query("select * from travelimage where ImageID={$id}");
    $rsDetail=$db->query("select * from travelimagedetails where ImageID={$id}");
    $rsLocation=$db->query("select * from travelimagelocations where ImageID={$id}");
    $rsRating=$db->query("select * from travelimagerating where ImageID={$id}");

    $all[$index]['image']=$rsImage->fetch_all();
    $all[$index]['detail']=$rsDetail->fetch_all();
    $all[$index]['location']=$rsLocation->fetch_all();
    $all[$index]['rating']=$rsRating->fetch_all();

    $index++;
}

echo json_encode($all);

$db->close();


?>