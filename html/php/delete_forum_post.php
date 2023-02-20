<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if(mysqli_connect_errno()){
	exit();
}

$post_id = strval($_POST["post_id"]);
$request = "DELETE FROM tags WHERE postid=$post_id;";
$request_2 = "DELETE FROM forum WHERE postid=$post_id;";
if($database->query($request)===TRUE && $database->query($request_2)===TRUE){ 
	echo "Success";
} else {
	echo "Error";
}	
mysqli_close($database);
?>
