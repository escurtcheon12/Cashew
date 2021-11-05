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
	$sql1 = 'SELECT * FROM list_shift ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'name_shift' => $r1['name_shift'],
			'shift_order' => $r1['shift_order'],
			'working_hours' => $r1['working_hours'],
			'finishing_work_hours' => $r1['finishing_work_hours'],
			'date' => $r1['date'],
			'no_shift' => $r1['no_shift'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$email = $_POST['email'];
	$name_shift = $_POST['name_shift'];
	$shift_order = $_POST['shift_order'];
	$working_hours = $_POST['working_hours'];
	$finishing_work_hours = $_POST['finishing_work_hours'];
	$date = date('Y-m-d', strtotime($_POST['date']));
	$no_shift = $_POST['no_shift'];

	$sql2 = "INSERT INTO list_shift(username, email, name_shift, shift_order, working_hours, finishing_work_hours, date, no_shift) VALUES('$username', '$email' ,'$name_shift','$shift_order','$working_hours','$finishing_work_hours','$date','$no_shift')";
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
	$sql3 = "SELECT * FROM list_shift WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r3['id'],
			'username' => $r3['username'],
			'email' => $r3['email'],
			'name_shift' => $r3['name_shift'],
			'shift_order' => $r3['shift_order'],
			'working_hours' => $r3['working_hours'],
			'finishing_work_hours' => $r3['finishing_work_hours'],
			'date' => $r3['date'],
			'no_shift' => $r3['no_shift'],
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
	$name_shift = $_POST['name_shift'];
	$shift_order = $_POST['shift_order'];
	$working_hours = $_POST['working_hours'];
	$finishing_work_hours = $_POST['finishing_work_hours'];
	$date = date('Y-m-d', strtotime($_POST['date']));
	$no_shift = $_POST['no_shift'];

	if($username) {
		$set[] = "username='$username'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($name_shift) {
		$set[] = "name_shift='$name_shift'";
	}
	if($shift_order) {
		$set[] = "shift_order='$shift_order'";
	}
	if($working_hours) {
		$set[] = "working_hours='$working_hours'";
	}
	if($finishing_work_hours) {
		$set[] = "finishing_work_hours='$finishing_work_hours'";
	}
	if($date) {
		$set[] = "date='$date'";
	}
	if($no_shift) {
		$set[] = "no_shift='$no_shift'";
	}

    $result = "data failed";
    if($username or $email or $name_shift or $shift_order or $working_hours or $finishing_work_hours  or $date or $no_shift){
        $sql1 = "UPDATE list_shift SET ".implode(",", $set)." WHERE id='$id'";
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
	$sql5 = "DELETE FROM list_shift WHERE id = '$id'";
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
