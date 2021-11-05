<?php
error_reporting(0);

$host= "localhost";
$user= "root";
$pass= "";
$db= "cashew";

$conn = mysqli_connect($host,$user,$pass,$db);

$op = $_GET['op'];

switch($op) {
 	case 'update':uploadImage();break;
}


function uploadImage() { 
global $conn;

$id = $_GET['id'];
$target_dir = 'upload/images';

if(!file_exists($target_dir)) {
	mkdir($target_dir, 0777, true);
}

$name = 'userPhoto' .date("Y-m-d",$t) . '_' .time() . '.jpeg';
$target_dir = $target_dir.'/'. $name;

// $sql1 = "UPDATE users SET image='.$name.' WHERE id='.$id.'";
$sql1 = "UPDATE users SET image='.$name.' WHERE id='95'";
$q1 = mysqli_query($conn,$sql1);

if(move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)) {

	echo json_encode([
		'Message' => 'The file has been uploaded.',
		'Status' => 'Ok'
	]);
} else {
	echo json_encode([
		'Message' => 'The file has been error uploaded.',
		'Status' => 'Error'
	]);
}
}
?>