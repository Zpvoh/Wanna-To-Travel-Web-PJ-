<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/5
 * Time: 14:19
 */

include_once "connectDatabase.php";

$rsPost=$db->query("select * from travelpost ORDER by PostTime DESC");
$imagesList=array();
$imagesPathList=array();
$index=0;

while ($rowPost=$rsPost->fetch_assoc()){
    $postID=$rowPost["PostID"];
    $rsPostImages=$db->query("select ImageID from travelpostimages WHERE PostID={$postID} limit {$_GET["Number"]}");
    while ($rowPostImages=$rsPostImages->fetch_assoc()){
        $imagesList[$index]=$rowPostImages["ImageID"];
        $rsImagePath=$db->query("select Path from travelimage where ImageID={$imagesList[$index]}");
        $rowImagePath=$rsImagePath->fetch_assoc();
        $imagesPathList[$index]=$rowImagePath["Path"];
        $index=$index+1;
    }
}

for($i=0; $i<(int)$_GET["Number"]; $i=$i+1){
    echo $imagesList[$i]."&".$imagesPathList[$i]."/";
}

$db->close();
?>