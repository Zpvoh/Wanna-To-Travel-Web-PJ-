<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/18
 * Time: 0:08
 */

$uid=$_GET['uid'];
$start=$_GET['start'];
$num=$_GET['num'];

include_once "connectDatabase.php";

$rs=$db->query("select tpi.ImageID, ti.Path, td.Title, td.Description 
                from travelpost as tp, travelpostimages as tpi, travelimagedetails as td, travelimage as ti 
                where tp.UID={$uid} and  tp.PostID=tpi.PostID and tpi.ImageID=ti.ImageID and td.ImageID=tpi.ImageID
                order by tp.PostTime limit {$start}, {$num}");

$rsNum=$db->query("select COUNT(travelpostimages.ImageID)
                from travelpost, travelpostimages
                where travelpost.UID={$uid} and travelpostimages.PostID=travelpost.PostID
                order by travelpost.UID");

echo json_encode($rs->fetch_all());
echo "&".$rsNum->fetch_assoc()['COUNT(travelpostimages.ImageID)'];

$db->close();