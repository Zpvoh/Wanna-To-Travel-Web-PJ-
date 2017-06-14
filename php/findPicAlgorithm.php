<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/7
 * Time: 14:40
 */

include_once "connectDatabase.php";

$rs=$db->query("select Path, UID from travelimage where ImageID={$_GET["ImageID"]}");
$row=$rs->fetch_assoc();
$rsDetail=$db->query("select Description, Title, Latitude, Longitude, CityCode, CountryCodeISO from travelimagedetails where ImageID={$_GET["ImageID"]}");
$rowDetail=$rsDetail->fetch_assoc();

$path=$row["Path"];
$uid=$row["UID"];
$description=$rowDetail["Description"];
$title=$rowDetail["Title"];
$latitude=$rowDetail["Latitude"];
$longitude=$rowDetail["Longitude"];
$cityCode=$rowDetail["CityCode"];
$countryCodeISO=$rowDetail["CountryCodeISO"];

$rsUser=$db->query("select FirstName, LastName from traveluserdetails WHERE UID={$uid}");
if($rsUser) {
    $rowUser = $rsUser->fetch_assoc();
    $name = $rowUser['FirstName'] . " " . $rowUser['LastName'];
}else{
    $name="Nameless";
}

$rsCities=$db->query("select AsciiName from geocities where GeoNameID={$cityCode}");
if($rsCities) {
    $rowCities = $rsCities->fetch_assoc();
    $city = $rowCities['AsciiName'];
}else{
    $city="I don't know";
}

$rsCountries=$db->query("select CountryName from geocountries where ISO='{$countryCodeISO}'");
if($rsCountries) {
    $rowCountries = $rsCountries->fetch_assoc();
    $country = $rowCountries['CountryName'];
}else{
    $country="I don't know";
}

$favorUID=0;
if(isset($_GET['uid'])){
    $favorUID=$_GET['uid'];
}

$rsFavor=$db->query("select * from travelimagefavor WHERE UID={$favorUID} AND ImageID={$_GET['ImageID']}");

if($rsFavor->fetch_assoc()){
    $isFavor="Favourite";
}else{
    $isFavor="Add to favourite";
}

$rsFavorNum=$db->query("select count(*) from travelimagefavor WHERE ImageID={$_GET['ImageID']}");
$favorNum=$rsFavorNum->fetch_assoc()['count(*)'];