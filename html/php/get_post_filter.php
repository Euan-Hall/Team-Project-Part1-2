<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
	exit();
}

$title = $_POST["title"];
$author = $_POST["author"];
$date_ = implode(' ', array_reverse(explode(' ', $_POST['date'])));

$where = ($title!=""||$author!=""||$date_!="")?"WHERE ":"";
$title = ($title!="")?" title='$title' " : "";
$author = ($author!="")?" author='$author' " : "";
$date_ = ($date_!="")?" date='$date_' ":"";

// If there are 2 which aren't empty, there is one and. If all 3 aren't empty, then there is 2 ands.
// Else, none.
$and_1 = ($title!=""&&$date_!=""||$title!=""&&$author!=""||$author!=""&&$date_!="")?" AND ":"";
$and_2 = ($title!=""&&$date_=""&&$author!="")?" AND ":"";


$request = "SELECT * FROM forum " . $where . $title . $and_1 . $author . $and_2 . $date_;
$result = $database->query($request);
$dataArray = array();



if (mysqli_num_row($result) > 0) {
	//while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
	//	$dataArray[] = $row;
	//}
	echo mysqli_num_row($result);
}

echo json_encode($dataArray);
mysqli_close($database);
?>
