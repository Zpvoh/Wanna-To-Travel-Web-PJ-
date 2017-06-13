<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/11
 * Time: 16:17
 */

$name=$_GET['name'];
$type=$_GET['type'];
$start=$_GET['start'];
$end=$_GET['end'];

include_once "connectDatabase.php";

switch ($type){
    case "continent":
        $rs=$db->query("select travelimagedetails.ImageID, travelimage.Path
                          from travelimage, travelimagedetails, geocountries, geocontinents
                          WHERE geocontinents.ContinentCode='{$name}' AND geocontinents.ContinentCode=geocountries.Continent AND geocountries.ISO=travelimagedetails.CountryCodeISO AND travelimage.ImageID=travelimagedetails.ImageID 
                          ORDER BY travelimage.ImageID Limit {$start}, {$end}");
        $rsCount=$db->query("select COUNT(*)
                          from travelimage, travelimagedetails, geocountries, geocontinents
                          WHERE geocontinents.ContinentCode='{$name}' AND geocontinents.ContinentCode=geocountries.Continent AND geocountries.ISO=travelimagedetails.CountryCodeISO AND travelimage.ImageID=travelimagedetails.ImageID 
                          ORDER BY travelimage.ImageID");
        echo json_encode($rs->fetch_all());
        echo "&".$rsCount->fetch_assoc()['COUNT(*)'];
        break;

    case "country":
        $rs=$db->query("select travelimage.ImageID, travelimage.Path
                          from travelimagedetails, travelimage
                          WHERE CountryCodeISO='{$name}'AND travelimagedetails.ImageID=travelimage.ImageID
                          ORDER BY travelimage.ImageID Limit {$start}, {$end}");

        $rsCount=$db->query("select COUNT(*)
                          from travelimagedetails, travelimage
                          WHERE CountryCodeISO='{$name}'AND travelimagedetails.ImageID=travelimage.ImageID
                          ORDER BY travelimage.ImageID");
        echo json_encode($rs->fetch_all());
        echo "&".$rsCount->fetch_assoc()['COUNT(*)'];
        break;

    case "city":
        $rs=$db->query("select travelimage.ImageID, travelimage.Path
                          from travelimagedetails, travelimage
                          WHERE CityCode='{$name}' AND travelimagedetails.ImageID=travelimage.ImageID
                          ORDER BY travelimage.ImageID Limit {$start}, {$end}");

        $rsCount=$db->query("select COUNT(*)
                          from travelimagedetails, travelimage
                          WHERE CityCode='{$name}' AND travelimagedetails.ImageID=travelimage.ImageID
                          ORDER BY travelimage.ImageID");
        echo json_encode($rs->fetch_all());
        echo "&".$rsCount->fetch_assoc()['COUNT(*)'];
        break;
}