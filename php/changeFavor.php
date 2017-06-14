<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/14
 * Time: 23:43
 */
include_once "connectDatabase.php";

$type=$_GET['type'];

if($type=="append") {
    $db->query("insert into travelimagefavor
            (UID, ImageID)
            VALUES 
            ({$_GET['uid']}, {$_GET['ImageID']})");

    if ($db->error == "") {
        echo "Ok";
    } else {
        echo $db->error;
    }
}else if($type=="delete"){
    $db->query("delete from travelimagefavor
                WHERE UID={$_GET['uid']} and ImageID={$_GET['ImageID']}");

    if ($db->error == "") {
        echo "Ok";
    } else {
        echo $db->error;
    }
}

$db->close();