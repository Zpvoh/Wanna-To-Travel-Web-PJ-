<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/14
 * Time: 17:00
 */

$type=$_GET['type'];
$condition=$_GET['condition'];
$start=$_GET['start'];
$num=$_GET['num'];

include_once "connectDatabase.php";

switch ($type){
    case "title":
        $rsByTitle=$db->query("select td.ImageID, ti.Path, td.Title, td.Description
                                from travelimage as ti, travelimagedetails as td
                                where td.Title like '%{$condition}%' and td.ImageID=ti.ImageID
                                order by ti.ImageID limit {$start}, {$num}");

        echo json_encode($rsByTitle->fetch_all());

        $rsTotalNum=$db->query("select COUNT(*)
                                from travelimage as ti, travelimagedetails as td
                                where td.Title like '%{$condition}%' and td.ImageID=ti.ImageID
                                order by ti.ImageID");
        echo "&".$rsTotalNum->fetch_assoc()['COUNT(*)'];

        break;

    case "description":
        $rsByDescription=$db->query("select td.ImageID, ti.Path, td.Title, td.Description
                                from travelimage as ti, travelimagedetails as td
                                where td.Description like '%{$condition}%' and td.ImageID=ti.ImageID
                                order by ti.ImageID limit {$start}, {$num}");

        echo json_encode($rsByDescription->fetch_all());

        $rsTotalNum=$db->query("select COUNT(*)
                                from travelimage as ti, travelimagedetails as td
                                where td.Description like '%{$condition}%' and td.ImageID=ti.ImageID
                                order by ti.ImageID");
        echo "&".$rsTotalNum->fetch_assoc()['COUNT(*)'];
        break;

}