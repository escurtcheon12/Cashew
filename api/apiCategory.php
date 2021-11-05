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
}

function normal() {
	global $conn;
	$sql1 = 'SELECT * FROM category ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'menu' => $r1['menu'],
			'category' => $r1['category'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$email = $_POST['email'];
	$menu = $_POST['menu'];
	$category = $_POST['category'];

	$sql2 = "INSERT INTO category(username,email,menu,category) VALUES('$username','$email','$menu','$category')";
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
	$sql3 = "SELECT * FROM category WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'menu' => $r1['menu'],
			'category' => $r1['category'],
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
	$category = $_POST['category'];

	if($username) {
		$set[] = "username='$username'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($category) {
		$set[] = "category='$category'";
	}

    $result = "data failed";
    if($username or $email or $category){
        $sql1 = "UPDATE category SET ".implode(",", $set)." WHERE id='$id'";
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
	$sql5 = "DELETE FROM category WHERE id = '$id'";
	$q5 = mysqli_query($conn, $sql5);

	if($q5) {
		$result = 'data deleted';
	} else {
		$result = 'data failed deleted';
	}
	$data['data']['result'] = $result;
	echo json_encode($data);
}
?>
