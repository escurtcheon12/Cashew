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
	$sql1 = 'SELECT * FROM transactions ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'no_payment' => $r1['no_payment'],
			'menu' => $r1['menu'],
			'item' => $r1['item'],
			'price' => $r1['price'],
			'date' => $r1['date'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$email = $_POST['email'];
	$no_payment = $_POST['no_payment'];
	$menu = $_POST['menu'];
	$item = $_POST['item'];
	$price = $_POST['price'];
	$date = date('Y-m-d', strtotime($_POST['date']));

	$sql2 = "INSERT INTO transactions(username, email, no_payment, menu, item, price, date) VALUES('$username', '$email' ,'$no_payment','$menu','$item','$price', '$date')";
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
	$sql3 = "SELECT * FROM transactions WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r3['id'],
			'username' => $r3['username'],
			'email' => $r3['email'],
			'no_payment' => $r3['no_payment'],
			'menu' => $r3['menu'],
			'item' => $r3['item'],
			'price' => $r3['price'],
			'date' => $r3['date'],
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
	$no_payment = $_POST['no_payment'];
	$menu = $_POST['menu'];
	$item = $_POST['item'];
	$price = $_POST['price'];
	$date = date('Y-m-d', strtotime($_POST['date']));

	if($username) {
		$set[] = "username='$username'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($no_payment) {
		$set[] = "no_payment='$no_payment'";
	}
	if($menu) {
		$set[] = "menu='$menu'";
	}
	if($item) {
		$set[] = "item='$item'";
	}
	if($price) {
		$set[] = "price='$price'";
	}
	if($date) {
		$set[] = "date='$date'";
	}

    $result = "data failed";
    if($username or $email or $no_payment or $menu or $item or $price or $date){
        $sql1 = "UPDATE transactions SET ".implode(",", $set)." WHERE id='$id'";
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
	$sql5 = "DELETE FROM transactions WHERE id = '$id'";
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
