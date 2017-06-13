<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/11
 * Time: 14:42
 */
$type = $_GET['type'];
if(isset($_GET['continent'])) {
    $continent = $_GET['continent'];
}
if(isset($_GET['country'])) {
    $country = $_GET['country'];
}

include_once "connectDatabase.php";

switch ($type) {
    case 'get_continent_list':
        $result = $db->query("SELECT GeoNameId, ContinentName, ContinentCode from geocontinents ORDER BY ContinentName");
        $json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_country_list':
        $result = $db->query("SELECT GeoNameID, CountryName, ISO from geocountries WHERE Continent='{$continent}' ORDER BY CountryName");
        $json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
        if(!$json){
            echo mysqli_error($db);
        }
        echo json_encode($json);
        break;

    case 'get_city_list':
        $result = $db->query("SELECT GeoNameID, AsciiName, CountryCodeISO from geocities where CountryCodeISO='{$country}' ORDER By AsciiName");
        $json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
}
