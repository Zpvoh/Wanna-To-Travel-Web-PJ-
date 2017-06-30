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
$imageID=1;
// 允许上传的图片后缀
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);     // 获取文件后缀名
$path=rand(1000000000, 9999999999).".".$extension;
if ((($_FILES["file"]["type"] == "image/gif")
        || ($_FILES["file"]["type"] == "image/jpeg")
        || ($_FILES["file"]["type"] == "image/jpg")
        || ($_FILES["file"]["type"] == "image/pjpeg")
        || ($_FILES["file"]["type"] == "image/x-png")
        || ($_FILES["file"]["type"] == "image/png"))
    && ($_FILES["file"]["size"] < 20000*1024)   // 小于 200 kb
    )
{
    if ($_FILES["file"]["error"] > 0)
    {
        die("错误：: " . $_FILES["file"]["error"] . "<br>");
    }
    else
    {

        // 判断../img/travel-images/large/目录是否存在该文件
        // 如果没有../img/travel-images/large/目录，你需要创建它
        while (file_exists("../img/travel-images/large/" . $path))
        {
            $path=rand(1000000000, 9999999999).".".$extension;
        }
            // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
            move_uploaded_file($_FILES["file"]["tmp_name"], "../img/travel-images/large/" . $path);
            clipPic();
            $db->begin_transaction();
            insertImage();
            insertPost();
            changeModifyTime();
            $db->commit();
            echo "Done";

    }
}
else
{
    echo "You should upload an image file of .jpg, .jpeg, .png, .gif and the size should be smaller than 20M";
    var_dump($_FILES);
    var_dump($_POST);
    echo $_FILES['file']['error'];
}

function changeModifyTime(){
    global $db, $uid;
    $db->query("update traveluser
                set DateLastModified=now()
                WHERE UID={$uid}");
}

function insertImage(){
    global $db, $imageID, $path;

    $db->query("insert into travelimage
                 (UID, Path)
                 VALUES 
                 ({$_POST['uid']}, '{$path}')");

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
                ({$imageID}, '{$db->real_escape_string($_POST['photoName'])}', '{$db->real_escape_string($_POST['description'])}', 
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
                 ({$_POST['uid']}, '{$db->real_escape_string($_POST['photoName'])}', '{$db->real_escape_string($_POST['description'])}', now())");

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

function clipPic(){
    global $path;
    $smedium=['x'=>'0', 'y'=>'0', 'width'=>'150', 'height'=>'150'];
    $ssmall=['x'=>'0', 'y'=>'0', 'width'=>'75', 'height'=>'75'];
    $stiny=['x'=>'0', 'y'=>'0', 'width'=>'48', 'height'=>'48'];

    switch ($_FILES['file']['type']){
        case "image/gif":
            $img=imagecreatefromgif("../img/travel-images/large/" . $path);
            $width=imagesx($img);
            $height=imagesy($img);
            $imgM=imagecreatetruecolor($width/1.6, $height/1.6);
            $imgS=imagecreatetruecolor($width/3.2, $height/3.2);
            $imgT=imagecreatetruecolor($width/10.24, $height/10.24);

            imagecopyresized($imgM, $img, 0, 0, 0, 0, $width/1.6, $height/1.6, $width, $height);
            imagecopyresized($imgS, $imgM, 0, 0, 0, 0, $width/3.2, $height/3.2, $width, $height);
            imagecopyresized($imgT, $img, 0, 0, 0, 0, $width/10.24, $height/10.24, $width, $height);
            $smpic=imagecrop($imgM, $smedium);
            $sspic=imagecrop($imgS, $ssmall);
            $stpic=imagecrop($imgT, $stiny);
            imagegif($smpic, "../img/travel-images/square-medium/" . $path);
            imagegif($sspic, "../img/travel-images/square-small/" . $path);
            imagegif($stpic, "../img/travel-images/square-tiny/" . $path);
            imagegif($imgM, "../img/travel-images/medium/" . $path);
            imagegif($imgS, "../img/travel-images/small/" . $path);
            imagegif($imgT, "../img/travel-images/thumb/" . $path);
            break;

        case "image/jpeg":
        case "image/jpg":
        case "image/pjpeg":
        $img=imagecreatefromjpeg("../img/travel-images/large/" . $path);
        $width=imagesx($img);
        $height=imagesy($img);
        $imgM=imagecreatetruecolor($width/1.6, $height/1.6);
        $imgS=imagecreatetruecolor($width/3.2, $height/3.2);
        $imgT=imagecreatetruecolor($width/10.24, $height/10.24);

        imagecopyresized($imgM, $img, 0, 0, 0, 0, $width/1.6, $height/1.6, $width, $height);
        imagecopyresized($imgS, $imgM, 0, 0, 0, 0, $width/3.2, $height/3.2, $width, $height);
        imagecopyresized($imgT, $img, 0, 0, 0, 0, $width/10.24, $height/10.24, $width, $height);
        $smpic=imagecrop($imgM, $smedium);
        $sspic=imagecrop($imgS, $ssmall);
        $stpic=imagecrop($imgT, $stiny);
        imagejpeg($smpic, "../img/travel-images/square-medium/" . $path);
        imagejpeg($sspic, "../img/travel-images/square-small/" . $path);
        imagejpeg($stpic, "../img/travel-images/square-tiny/" . $path);
        imagejpeg($imgM, "../img/travel-images/medium/" . $path);
        imagejpeg($imgS, "../img/travel-images/small/" . $path);
        imagejpeg($imgT, "../img/travel-images/thumb/" . $path);
        break;

        case "image/x-png":
        case "image/png":
        $img=imagecreatefrompng("../img/travel-images/large/" . $path);
        $width=imagesx($img);
        $height=imagesy($img);
        $imgM=imagecreatetruecolor($width/1.6, $height/1.6);
        $imgS=imagecreatetruecolor($width/3.2, $height/3.2);
        $imgT=imagecreatetruecolor($width/10.24, $height/10.24);

        imagecopyresized($imgM, $img, 0, 0, 0, 0, $width/1.6, $height/1.6, $width, $height);
        imagecopyresized($imgS, $imgM, 0, 0, 0, 0, $width/3.2, $height/3.2, $width, $height);
        imagecopyresized($imgT, $img, 0, 0, 0, 0, $width/10.24, $height/10.24, $width, $height);
        $smpic=imagecrop($imgM, $smedium);
        $sspic=imagecrop($imgS, $ssmall);
        $stpic=imagecrop($imgT, $stiny);
        imagepng($smpic, "../img/travel-images/square-medium/" . $path);
        imagepng($sspic, "../img/travel-images/square-small/" . $path);
        imagepng($stpic, "../img/travel-images/square-tiny/" . $path);
        imagepng($imgM, "../img/travel-images/medium/" . $path);
        imagepng($imgS, "../img/travel-images/small/" . $path);
        imagepng($imgT, "../img/travel-images/thumb/" . $path);
        break;
    }
}

function rollback(){
    global $db, $path;

    unlink("../img/travel-images/large/" . $path);
    unlink("../img/travel-images/square-medium/" . $path);
    unlink("../img/travel-images/square-small/" . $path);
    unlink("../img/travel-images/square-tiny/" . $path);
    unlink("../img/travel-images/medium/" . $path);
    unlink("../img/travel-images/small/" . $path);
    unlink("../img/travel-images/thumb/" . $path);

    $db->query("rollback");
}

$db->close();