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
$rowUser=$rsUser->fetch_assoc();
$name=$rowUser['FirstName']." ".$rowUser['LastName'];

$rsCities=$db->query("select AsciiName from geocities where GeoNameID={$cityCode}");
$rowCities=$rsCities->fetch_assoc();
$city=$rowCities['AsciiName'];

$rsCountries=$db->query("select CountryName from geocountries where ISO='{$countryCodeISO}'");
$rowCountries=$rsCountries->fetch_assoc();
$country=$rowCountries['CountryName'];