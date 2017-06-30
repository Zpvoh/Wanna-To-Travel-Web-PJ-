<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/18
 * Time: 0:09
 */

$type=$_GET['type'];

include_once "connectDatabase.php";

$imageID=$_GET['ImageID'];
$postID=0;
$rsPath=$db->query("select Path from travelimage where ImageID={$imageID}");
$rowPath=$rsPath->fetch_assoc();
$path=$rowPath['Path'];

switch ($type){
    case "delete":
        $db->begin_transaction();
        $rsPost=$db->query("select PostID from travelpostimages WHERE ImageID={$imageID}");
        $rowPost=$rsPost->fetch_assoc();
        $postID=$rowPost['PostID'];

        $db->query("delete from travelpostimages WHERE ImageID={$imageID}");
        $db->query("delete from travelimagedetails WHERE ImageID={$imageID}");
        $db->query("delete from travelimagefavor WHERE ImageID={$imageID}");
        $db->query("delete from travelimage WHERE ImageID={$imageID} and UID={$_GET['uid']}");
        $rs=$db->query("select * from travelpostimages WHERE PostID={$postID}");
        if(!$rs->fetch_assoc()){
            $db->query("delete from travelpost WHERE PostID={$postID}");
        }

        if($db->error!=""){
            rollback();
        }
        $db->commit();

        unlink("../img/travel-images/large/" . $path);
        unlink("../img/travel-images/square-medium/" . $path);
        unlink("../img/travel-images/square-small/" . $path);
        unlink("../img/travel-images/square-tiny/" . $path);
        unlink("../img/travel-images/medium/" . $path);
        unlink("../img/travel-images/small/" . $path);
        unlink("../img/travel-images/thumb/" . $path);
        echo "Ok";

        break;

    case "modify":
        break;

}


function rollback(){
    global $db;

    $db->rollback();
    die($db->error);
}