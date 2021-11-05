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
	case 'login':login();break;
	case 'filterRegister':filterRegister();break;
	case 'uploadImage':uploadImage();break;
}

function normal() {
	global $conn;
	$sql1 = 'SELECT * FROM users ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'password' => $r1['password'],
			'email' => $r1['email'],
			'address' => $r1['address'],
			'post_code' => $r1['post_code'],
			'country' => $r1['country'],
			'city' => $r1['city'],
			'province' => $r1['province'],
			'image' => $r1['image'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$password = $_POST['password'];
	$email = $_POST['email'];
	$address = $_POST['address'];
	$post_code = $_POST['post_code'];
	$country = $_POST['country'];
	$city = $_POST['city'];
	$province = $_POST['province'];
	$image = $_POST['image'];

	$sql2 = "INSERT INTO users(username,password,email, address, post_code, country, city, province, image) VALUES('$username','$password','$email', '', '', '', '', '', '')";
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
	$sql3 = "SELECT * FROM users WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r3['id'],
			'username' => $r3['username'],
			'password' => $r3['password'],
			'email' => $r3['email'],
			'address' => $r3['address'],
			'post_code' => $r3['post_code'],
			'country' => $r3['country'],
			'city' => $r3['city'],
			'province' => $r3['province'],
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
	$password = $_POST['password'];
	$email = $_POST['email'];
	$address = $_POST['address'];
	$post_code = $_POST['post_code'];
	$country = $_POST['country'];
	$city = $_POST['city'];
	$province = $_POST['province'];
	$image = $_POST['image'];


	if($username) {
		$set[] = "username='$username'";
	}
	if($password) {
		$set[] = "password='$password'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($address) {
		$set[] = "address='$address'";
	}
	if($post_code) {
		$set[] = "post_code='$post_code'";
	}
	if($country) {
		$set[] = "country='$country'";
	}
	if($city) {
		$set[] = "city='$city'";
	}
	if($province) {
		$set[] = "province='$province'";
	}
	if($image) {
		$set[] = "image='$image'";
	}

    $result = "data failed";
    if($username or $password or $email or $address or $post_code or $country or $city or $province or $image){
        $sql1 = "UPDATE users SET ".implode(",", $set)." WHERE id='$id'";
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
	$sql5 = "DELETE FROM users WHERE id = '$id'";
	$q5 = mysqli_query($conn, $sql5);

	if($q5) {
		$result = 'data deleted';
	} else {
		$result = 'data failed deleted';
	}
	$data['data']['result'] = $result;
	echo json_encode($data);
}

function login() {
	global $conn;

	$id = $_GET['id'];
	$username = $_POST['username'];
	$email = $_POST['email']; 
	$password = $_POST['password']; 
	$image = $_POST['image'];

if($_POST['username'] != "") { 
	$data = array("status" => "correct", "username" => $username);
	$sql1 = "SELECT * FROM users WHERE username = '$username' and password = '$password'";
	$q1 = mysqli_query($conn, $sql1);

	if($q1->num_rows==0) {
		echo json_encode('wrong');

	} else {
		echo json_encode($data);
	}

} else if ($_POST['email'] != "") {  
	$data = array("status" => "correct","email" => $email);
	$sql3 = "SELECT * FROM users WHERE email = '$email' and password = '$password' ";
	$q3 = mysqli_query($conn, $sql3);

	if($q3->num_rows==0) {
		echo json_encode('wrong');

	} else {
		echo json_encode($data);
	}

} else {
	echo json_encode('try again');
}

}

function filterRegister() {
	global $conn;

	$id = $_GET['id'];
	$username = $_POST['username'];
	$email = $_POST['email']; 
	$password = $_POST['password']; 
	$image = $_POST['image'];

if ($_POST['username'] != "" && $_POST['email'] != "") {  
	$data = array("status" => "success");
	$sql3 = "SELECT * FROM users WHERE username = '$username' and email = '$email' ";
	$q3 = mysqli_query($conn, $sql3);

	if($q3->num_rows==0) {
		echo json_encode('wrong');

	} else {
		echo json_encode($data);
	}

} else {
	echo json_encode('try again');
}

}

// function register() {
// 	global $conn;

// 	$username = $_POST['username'];
// 	$password = $_POST['password'];
// 	$email = $_POST['email'];
// 	$address = $_POST['address'];
// 	$post_code = $_POST['post_code'];
// 	$country = $_POST['country'];
// 	$city = $_POST['city'];
// 	$province = $_POST['province'];
// 	$image = $_POST['image'];

// 	$sql2 = "INSERT INTO users(username,password,email, address, post_code, country, city, province, image) VALUES('$username','$password','$email', '', '', '', '', '', '')";
// 	$q2 = mysqli_query($conn, $sql2);
// 	if($q2) {
// 		$result = "Succes adding data";
// 	}
// 	$data['data']['result'] = $result;
// 	echo json_encode($data);
// }

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
$sql1 = "UPDATE users SET image='$name' WHERE id='$id'";
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