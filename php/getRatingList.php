<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/9
 * Time: 0:56
 */
include_once "connectDatabase.php";

$start=$_GET["start"];
$num=$_GET["num"];
$rsRatingList=$db->query("select ImageID, count(*) from travelimagefavor GROUP BY ImageID ORDER By COUNT(*) DESC Limit {$start}, {$num}");

$all=array();
$index=0;
while ($rowRating=$rsRatingList->fetch_assoc()){
    $id=$rowRating["ImageID"];
    $rsPath=$db->query("select Path from travelimage where ImageID={$id}");
    $rsDetail=$db->query("select Title, Description from travelimagedetails where ImageID={$id}");
    $rowPath=$rsPath->fetch_assoc();
    $rowDetail=$rsDetail->fetch_assoc();
    $all[$index]["id"]=$id;
    $all[$index]["path"]=$rowPath['Path'];
    $all[$index]["title"]=$rowDetail['Title'];
    $all[$index]["description"]=$rowDetail['Description'];

    $index++;
}

echo json_encode($all);

$db->close();