<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/15
 * Time: 19:28
 */

$uid=$_GET['uid'];
$start=$_GET['start'];
$num=$_GET['num'];

include_once "connectDatabase.php";

$rs=$db->query("select tf.ImageID, ti.Path, td.Title, td.Description 
                from travelimagefavor as tf, travelimage as ti, travelimagedetails as td 
                where tf.UID={$uid} and  tf.ImageID=ti.ImageID and td.ImageID=tf.ImageID
                order by tf.FavorID limit {$start}, {$num}");

$rsNum=$db->query("select COUNT(*)
                from travelimagefavor
                where UID={$uid}
                order by FavorID");

echo json_encode($rs->fetch_all());
echo "&".$rsNum->fetch_assoc()['COUNT(*)'];

$db->close();
