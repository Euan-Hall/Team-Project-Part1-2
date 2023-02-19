<?php>
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if(mysqli_connect_errno()){
	exit();
}

$post_id = strval($_POST["task_id"]);
$request = "DELETE p, pi FROM forum p JOIN tags pi ON p.postid=pi.postid WHERE postid = $postid";

if($database->query($request)===TRUE){
	echo "Success";
}else{
	echo "Error";
}

mysqli_close($database);
?>
