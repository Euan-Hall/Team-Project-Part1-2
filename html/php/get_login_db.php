<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

if (isset($_COOKIE["makeItAll_id"])) {
    $user_id = $_COOKIE["makeItAll_id"];
}
$request = "SELECT user_name FROM users WHERE user_id = " .$user_id;

$result = $database->query($request);

echo json_encode($result);
mysqli_close($database);
?>
