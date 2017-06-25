<?php
/**
 * Created by IntelliJ IDEA.
 * User: qyy
 * Date: 2017/6/18
 * Time: 3:27
 */
include_once "connectDatabase.php";

$uid=$_POST['uid'];
$title=$_POST['photoName'];
$message=$_POST['description'];
$imageID=$_POST['ImageID'];
// 允许上传的图片后缀
$allowedExts = array("gif", "jpeg", "jpg", "png");
if($_FILES["file"]["size"]!=0) {
    $path=$_FILES['file']['name'];
    $temp = explode(".", $_FILES["file"]["name"]);
    $extension = end($temp);     // 获取文件后缀名
    if ((($_FILES["file"]["type"] == "image/gif")
            || ($_FILES["file"]["type"] == "image/jpeg")
            || ($_FILES["file"]["type"] == "image/jpg")
            || ($_FILES["file"]["type"] == "image/pjpeg")
            || ($_FILES["file"]["type"] == "image/x-png")
            || ($_FILES["file"]["type"] == "image/png"))
        && ($_FILES["file"]["size"] < 10000 * 1024)   // 小于 10000 kb
    ) {
        if ($_FILES["file"]["error"] > 0) {
            die("错误：: " . $_FILES["file"]["error"] . "<br>");
        } else {

            // 判断../img/travel-images/large/目录是否存在该文件
            // 如果没有../img/travel-images/large/目录，你需要创建它
            while (file_exists("../img/travel-images/large/" . $path)) {
                $path = $path + rand(1000, 9999);
            }

            // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
            move_uploaded_file($_FILES["file"]["tmp_name"], "../img/travel-images/large/" . $path);
            clipPic();
            $db->begin_transaction();
            changeImage();
            changePost();
            changeModifyTime();
            $db->commit();
            echo "Done";

        }
    } else {
        echo "You should upload an image file of .jpg, .jpeg, .png, .gif";
        var_dump($_FILES);
        var_dump($_POST);
        echo $_FILES['file']['error'];
    }
}else{
    $db->begin_transaction();
    changeImage();
    changePost();
    changeModifyTime();
    $db->commit();
    echo "Done";
}

function changeModifyTime(){
    global $db, $uid;
    $db->query("update traveluser
                set DateLastModified=now()
                WHERE UID={$uid}");
}

function changeImage(){
    global $db, $imageID;

    if(isset($path)) {
        global $path;
        $rsOldPath = $db->query("select Path from travelimage WHERE ImageID={$imageID}");
        $oldPath = $rsOldPath->fetch_assoc()['Path'];
        deletePic($oldPath);

        $db->query("update travelimage
                 set Path= '{$path}'
                 WHERE ImageID='{$imageID}'");

        if (!getCode($_POST['city'], $_POST['country'])) {
            rollback();
            die("I am sorry. Is this place on the earth?");
        }
        $codes = getCode($_POST['city'], $_POST['country']);

        $db->query("update travelimagedetails
                set Title='{$db->real_escape_string($_POST['photoName'])}', 
                    Description= '{$db->real_escape_string($_POST['description'])}',
                     Latitude={$_POST['latitude']}, 
                     Longitude={$_POST['longitude']}, 
                     CityCode={$codes['GeoNameID']},
                      CountryCodeISO= '{$codes['ISO']}'
                WHERE ImageID={$imageID}");

        if ($db->error != "") {
            rollback();
            die($db->error);
        }
    }else{
        if (!getCode($_POST['city'], $_POST['country'])) {
            rollback();
            die("I am sorry. Is this place on the earth?");
        }
        $codes = getCode($_POST['city'], $_POST['country']);

        $db->query("update travelimagedetails
                set Title='{$db->real_escape_string($_POST['photoName'])}', 
                    Description= '{$db->real_escape_string($_POST['description'])}',
                     Latitude={$_POST['latitude']}, 
                     Longitude={$_POST['longitude']}, 
                     CityCode={$codes['GeoNameID']},
                      CountryCodeISO= '{$codes['ISO']}'
                WHERE ImageID={$imageID}");

        if ($db->error != "") {
            rollback();
            die($db->error);
        }
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

function changePost(){
    global $db, $imageID;

    $rsPost=$db->query("select PostID from travelpostimages
                        WHERE ImageID={$imageID}");

    $post=$rsPost->fetch_assoc();
    $postID=$post['PostID'];

    $db->query("update travelpost
                set Title='{$db->real_escape_string($_POST['photoName'])}', 
                    Message='{$db->real_escape_string($_POST['description'])}', 
                    PostTime=now()
                 WHERE PostID={$postID}");

    $db->query("delete from travelimagefavor WHERE ImageID={$imageID}");

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

function deletePic($oldPath){
    unlink("../img/travel-images/large/" . $oldPath);
    unlink("../img/travel-images/square-medium/" . $oldPath);
    unlink("../img/travel-images/square-small/" . $oldPath);
    unlink("../img/travel-images/square-tiny/" . $oldPath);
    unlink("../img/travel-images/medium/" . $oldPath);
    unlink("../img/travel-images/small/" . $oldPath);
    unlink("../img/travel-images/thumb/" . $oldPath);
}

function rollback(){
    global $db;

    if(isset($path)) {
        global $path;
        unlink("../img/travel-images/large/" . $path);
        unlink("../img/travel-images/square-medium/" . $path);
        unlink("../img/travel-images/square-small/" . $path);
        unlink("../img/travel-images/square-tiny/" . $path);
        unlink("../img/travel-images/medium/" . $path);
        unlink("../img/travel-images/small/" . $path);
        unlink("../img/travel-images/thumb/" . $path);
    }

    $db->query("rollback");
}

$db->close();