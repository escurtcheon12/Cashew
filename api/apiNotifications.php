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
	case 'countUnread':countUnread();break;
}

function normal() {
	global $conn;
	$sql1 = 'SELECT * FROM notifications ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'cashier_name' => $r1['cashier_name'],
			'email' => $r1['email'],
			'message' => $r1['message'],
			'status' => $r1['status'],
			'date' => $r1['date'],
			'time' => $r1['time'],
			'no_payment' => $r1['no_payment'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$email = $_POST['email'];
	$cashier_name = $_POST['cashier_name'];
	$message = $_POST['message'];
	$status = $_POST['status'];
	$date = date('Y-m-d', strtotime($_POST['date']));
	$time = $_POST['time'];
	$no_payment = $_POST['no_payment'];

	$sql2 = "INSERT INTO notifications(username, email, cashier_name, message, status, date, time ,no_payment) VALUES('$username', '$email', '$cashier_name' ,'$message','$status','$date', '$time' ,'$no_payment')";
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
	$sql3 = "SELECT * FROM notifications WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r3['id'],
			'username' => $r3['username'],
			'email' => $r3['email'],
			'cashier_name' => $r3['cashier_name'],
			'message' => $r3['message'],
			'status' => $r3['status'],
			'date' => $r3['date'],
			'time' => $r3['time'],
			'no_payment' => $r3['no_payment'],
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
	$cashier_name = $_POST['cashier_name'];
	$message = $_POST['message'];
	$status = $_POST['status'];
	$date = date('Y-m-d', strtotime($_POST['date']));
	$time = $_POST['time'];

	if($username) {
		$set[] = "username='$username'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($cashier_name) {
		$set[] = "cashier_name='$cashier_name'";
	}
	if($message) {
		$set[] = "message='$message'";
	}
	if($status) {
		$set[] = "status='$status'";
	}
	if($date) {
		$set[] = "date='$date'";
	}
	if($time) {
		$set[] = "time='$time'";
	}
	if($no_payment) {
		$set[] = "no_payment='$no_payment'";
	}

    $result = "data failed";
    if($username or $email or $cashier_name or $message or $date or $time or $no_payment){
        $sql1 = "UPDATE notifications SET ".implode(",", $set)." WHERE id='$id'";
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
	$sql5 = "DELETE FROM notifications WHERE id = '$id'";
	$q5 = mysqli_query($conn, $sql5);

	if($q5) {
		$result = 'data deleted';
	} else {
		$result = 'data failed deleted';
	}
	$data['data']['result'] = $result;
	echo json_encode($data);
}

function countUnread() {
	global $conn;
	$sql1 = "SELECT COUNT(*) FROM notifications WHERE status='unread'";
	$q1 = mysqli_query($conn, $sql1);
	$r4 = mysqli_fetch_array($q1);	
	$result[] = $r4[0];
	$data['data']['result'] = $result;
	echo json_encode($data);
}
?>
