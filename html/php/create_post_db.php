<?php
// Show all errors 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Connect to SQL
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
	exit();
}


$title = strval($_POST["title"]);
$contents = "test";     //strval(json_decode(utf8_encode($_POST["contents"])));
$author = strval($_POST["author_id"]);
$_date = implode('/', array_reverse(explode('/', $_POST["post_date"])));
// DATE YYYY/M/DD


// Process request
$request = "INSERT INTO forum(postid, title, contents, author_id, post_date) VALUES (NULL, '$title','$contents', '$author', '$_date')";


// Checking return
if($database->query($request)===TRUE){
	$tags = explode(',', str_replace(' ', '', $_POST['tags']));
	foreach ($tags as $tag) {
		$request = "INSERT INTO tags(tagid, tag, postid) SELECT NULL, '$tag', max(postid) FROM forum";
		if($database->query($request)===TRUE){
			echo "Success";
		}else{
			echo "Error: $request";
		}
	};
} else {
	echo "Error: " . $request;
}
mysqli_close($database);
?>
