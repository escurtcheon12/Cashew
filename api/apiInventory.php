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
	$sql1 = 'SELECT * FROM inventory ORDER BY id DESC';
	$q1 = mysqli_query($conn, $sql1);
	while($r1 = mysqli_fetch_array($q1)) {
		$result[] = array(
			'id' => $r1['id'],
			'username' => $r1['username'],
			'email' => $r1['email'],
			'inventory_name' => $r1['inventory_name'],
			'total' => $r1['total'],
			'unit' => $r1['unit'],
			'deadline' => $r1['deadline'],
		);
	}
		$data['data']['result'] = $result;
		echo json_encode($data);
}

function create() {
	global $conn;

	$username = $_POST['username'];
	$email = $_POST['email'];
	$inventory_name = $_POST['inventory_name'];
	$total = $_POST['total'];
	$unit = $_POST['unit'];

	$sql2 = "INSERT INTO inventory(username,email,inventory_name,total,unit) VALUES('$username','$email','$inventory_name','$total','$unit')";
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
	$sql3 = "SELECT * FROM inventory WHERE id = '$id'";
	$q3 = mysqli_query($conn, $sql3);
	while($r3 = mysqli_fetch_array($q3)) {
		$result[] = array(
			'id' => $r3['id'],
			'username' => $r3['username'],
			'email' => $r3['email'],
			'inventory_name' => $r3['inventory_name'],
			'total' => $r3['total'],
			'unit' => $r3['unit'],
			'deadline' => $r3['deadline'],
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
	$inventory_name = $_POST['inventory_name'];
	$total = $_POST['total'];
	$unit = $_POST['unit'];
	$deadline = date('Y-m-d', strtotime($_POST['deadline']));


	if($username) {
		$set[] = "username='$username'";
	}
	if($email) {
		$set[] = "email='$email'";
	}
	if($inventory_name) {
		$set[] = "inventory_name='$inventory_name'";
	}
	if($total) {
		$set[] = "total='$total'";
	}
	if($unit) {
		$set[] = "unit='$unit'";
	}
	if($deadline) {
		$set[] = "deadline='$deadline'";
	}

    $result = "data failed";
    if($username or $email or $inventory_name or $total or $unit or $deadline){
        $sql1 = "UPDATE inventory SET ".implode(",", $set)." WHERE id='$id'";
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
	$sql5 = "DELETE FROM inventory WHERE id = '$id'";
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
