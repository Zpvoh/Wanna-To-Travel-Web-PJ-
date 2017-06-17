<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/17
 * Time: 12:46
 */
include_once "connectDatabase.php";

$uid=$_POST['uid'];
$title=$_POST['photoName'];
$message=$_POST['description'];
$imageID;
// 允许上传的图片后缀
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);     // 获取文件后缀名
if ((($_FILES["file"]["type"] == "image/gif")
        || ($_FILES["file"]["type"] == "image/jpeg")
        || ($_FILES["file"]["type"] == "image/jpg")
        || ($_FILES["file"]["type"] == "image/pjpeg")
        || ($_FILES["file"]["type"] == "image/x-png")
        || ($_FILES["file"]["type"] == "image/png"))
    && ($_FILES["file"]["size"] < 5000*1024)   // 小于 200 kb
    && in_array($extension, $allowedExts))
{
    if ($_FILES["file"]["error"] > 0)
    {
        echo "错误：: " . $_FILES["file"]["error"] . "<br>";
    }
    else
    {

        // 判断../img/travel-images/large/目录是否存在该文件
        // 如果没有../img/travel-images/large/目录，你需要创建它
        if (file_exists("../img/travel-images/large/" . $_FILES["file"]["name"]))
        {
            echo $_FILES["file"]["name"] . " 文件已经存在。 ";
        }
        else
        {
            // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
            move_uploaded_file($_FILES["file"]["tmp_name"], "../img/travel-images/large/" . $_FILES["file"]["name"]);
            $db->begin_transaction();
            insertImage();
            insertPost();
            $db->commit();
            echo "Done";

        }
    }
}
else
{
    echo "You should upload an image file of .jpg, .jpeg, .png, .gif";
    var_dump($_FILES);
    var_dump($_POST);
    echo $_FILES['file']['error'];
}

function insertImage(){
    global $db, $imageID;

    $db->query("insert into travelimage
                 (UID, Path)
                 VALUES 
                 ({$_POST['uid']}, '{$_FILES['file']['name']}')");

    $rsImage=$db->query("select ImageID from travelimage
                          ORDER by ImageID DESC limit 1");

    $imageID=$rsImage->fetch_assoc()['ImageID'];
    if(!getCode($_POST['city'], $_POST['country'])){
        rollback();
        die("I am sorry. Is this place on the earth?");
    }
    $codes=getCode($_POST['city'], $_POST['country']);

    $db->query("insert into travelimagedetails
                (ImageID, Title, Description, Latitude, Longitude, CityCode, CountryCodeISO)
                VALUES 
                ({$imageID}, '{$_POST['photoName']}', '{$_POST['description']}', 
                {$_POST['latitude']}, {$_POST['longitude']}, {$codes['GeoNameID']}, '{$codes['ISO']}')");
    if($db->error!=""){
        rollback();
        die($db->error);
    }
}

function getCode($cityName, $countryName){
    global $db;

    $rs=$db->query("select city.GeoNameID, country.ISO 
                    from geocities as city, geocountries as country
                    where city.CountryCodeISO=country.ISO 
                    and country.CountryName='{$countryName}'
                    and city.AsciiName='{$cityName}'");

    while ($row=$rs->fetch_assoc()){
        return $row;
    }

    return false;
}

function insertPost(){
    global $db, $imageID;

    $db->query("insert into travelpost
                 (UID, Title, Message, PostTime)
                 VALUES 
                 ({$_POST['uid']}, '{$_POST['photoName']}', '{$_POST['description']}', now())");

    $rsPost=$db->query("select PostID from travelpost
                        ORDER by PostID DESC");

    $post=$rsPost->fetch_assoc();
    $postID=$post['PostID'];

    $db->query("insert into travelpostimages
                (ImageID, PostID)
                VALUES 
                ({$imageID}, {$postID})");

    if($db->error!=""){
       rollback();
        die($db->error);
    }
}

function rollback(){
    global $db;

    unlink("../img/travel-images/large/" . $_FILES["file"]["name"]);
    $db->query("rollback");
}

$db->close();