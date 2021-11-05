<?php
error_reporting(0);

$host= "localhost";
$user= "root";
$pass= "";
$db= "cashew";

$conn = mysqli_connect($host,$user,$pass,$db);

$op = $_GET['op'];

switch($op) {
	case '':normal();break;
	default:normal();break;
	case 'create':create();break;
	case 'detail':detail();break;
	case 'update':update();break;
	case 'delete':deletee();break;
	case 'uploadFood':uploadFood();break;
}

function normal() {
	global $conn;
	$sql1 = 'SELECT * FROM food ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'food_name' => $r1['food_name'],
			'description' => $r1['description'],
			'price' => $r1['price'],
			'category' => $r1['category'],
			'image' => $r1['image'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$email = $_POST['email'];
	$food_name = $_POST['food_name'];
	$description = $_POST['description'];
	$price = $_POST['price'];
	$category = $_POST['category'];

	$sql2 = "INSERT INTO food(username,email,food_name,description,price,category) VALUES('$username','$email','$food_name','$description','$price','$category')";
	$q2 = mysqli_query($conn, $sql2);
	if($q2) {
		$result = "Succes adding data";
	}
	$data['data']['result'] = $result;
	echo json_encode($data);
}

function detail() {
	global $conn;

	$id = $_GET['id'];
	$sql3 = "SELECT * FROM food WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r3['id'],
			'username' => $r3['username'],
			'email' => $r3['email'],
			'food_name' => $r3['food_name'],
			'description' => $r3['description'],
			'price' => $r3['price'],
			'category' => $r3['category'],
			'image' => $r3['image'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function update(){
    global $conn;

	$id = $_GET['id'];
	$username = $_POST['username'];
	$email = $_POST['email'];
	$food_name = $_POST['food_name'];
	$description = $_POST['description'];
	$price = $_POST['price'];
	$category = $_POST['category'];
	$image = $_POST['image'];

	if($username) {
		$set[] = "username='$username'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($food_name) {
		$set[] = "food_name='$food_name'";
	}
	if($description) {
		$set[] = "description='$description'";
	}
	if($price) {
		$set[] = "price='$price'";
	}
	if($category) {
		$set[] = "category='$category'";
	}
	if($image) {
		$set[] = "image='$image'";
	}

    $result = "data failed";
    if($username or $email or $food_name or $description or $price or $category or $image){
        $sql1 = "UPDATE food SET ".implode(",", $set)." WHERE id='$id'";
        $q1 = mysqli_query($conn,$sql1);
        if($q1){
            $result = "data succes";
        }
    }
    $data['data']['result'] = $result;
    echo json_encode($data);
}

function deletee() {
	global $conn;
	$id = $_GET['id'];
	$sql5 = "DELETE FROM food WHERE id = '$id'";
	$q5 = mysqli_query($conn, $sql5);

	if($q5) {
		$result = 'data deleted';
	} else {
		$result = 'data failed deleted';
	}
	$data['data']['result'] = $result;
	echo json_encode($data);
}

function uploadFood() { 
global $conn;

$id = $_GET['id'];
$target_dir = 'upload/food/images';

if(!file_exists($target_dir)) {
	mkdir($target_dir, 0777, true);
}

$name = 'userPhoto' .date("Y-m-d",$t) . '_' .time() . '.jpeg';
$target_dir = $target_dir.'/'. $name;

$sql1 = "UPDATE food SET image='$name' WHERE id='$id'";
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
