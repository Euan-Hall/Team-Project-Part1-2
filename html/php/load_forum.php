<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if(mysqli_connect_errno()){
	exit();
}

$request = "SELECT forum.postid, forum.title, forum.contents, users.user_email as author, forum.post_date FROM forum INNER JOIN users ON forum.author_id = users.user_id;";
$result = $database->query($request);
$dataArray = array();

if (mysqli_num_rows($result) > 0){
	while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
		$dataArray[] = $row;
	}
}

echo json_encode($dataArray);
mysqli_close($database);
?>
