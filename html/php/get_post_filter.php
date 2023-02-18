<?php 
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
	exit();
}

$title = $_POST["title"];
$author = $_POST["author"];
$date = $_DATE["date"];

$request = "SELECT * FROM forum WHERE title='$title' AND author='$author' AND date='$date'";
$result = $database->query($request);
$dataArray = array();

if (mysqli_num_row($result) > 0) {
	while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
		$dataArray[] = $row;
	}
}

echo json_encode($dataArray);
mysqli_close($database);
?>
