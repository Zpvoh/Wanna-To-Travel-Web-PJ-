<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/3
 * Time: 0:39
 */
include_once "findPicAlgorithm.php";

echo $path."&";
echo $description."&";
echo $title."&";
echo $latitude."&";
echo $longitude."&";
echo $name."&";
echo $country."&";
echo $city."&";
echo $isFavor."&";
echo $favorNum;
if(isset($continent)){
    echo "&".$continent;
}else{
    echo "&I don't know";
}

$db->close();
