<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/5
 * Time: 1:11
 */
include_once "connectDatabase.php";

$rs=$db->query("select * from {$_GET["Table"]} where {$_GET["Condition"]} ORDER by ImageRatingID DESC ");
while($row=$rs->fetch_assoc()){
    $id=$row["ImageID"];
    $rsImage=$db->query("select * from travelimage where ImageID={$id}");
    $rsDetail=$db->query("select * from travelimagedetails where ImageID={$id}");
    $rsLocation=$db->query("select * from travelimagelocations where ImageID={$id}");
    $rsRating=$db->query("select * from travelimagerating where ImageID={$id}");


    while ($rowImage=$rsImage->fetch_assoc()) {
        foreach ($rowImage as $ele) {
            echo $ele . "/&";
        }
        echo "//";
    }
    echo "/,";

    while ($rowDetail=$rsDetail->fetch_assoc()) {
        foreach ($rowDetail as $ele) {
            echo $ele . "/&";
        }
        echo "//";
    }
    echo "/,";

    while ($rowLocation=$rsLocation->fetch_assoc()) {
        foreach ($rowLocation as $ele) {
            echo $ele . "/&";
        }
        echo "//";
    }
    echo "/,";

    while ($rowRating=$rsRating->fetch_assoc()) {
        foreach ($rowRating as $ele) {
            echo $ele . "/&";
        }
        echo "//";
    }

    echo "/,";

    echo "/;";
}

$db->close();


?>