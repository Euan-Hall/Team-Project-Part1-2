<?php
$hostname = "sci-project.lboro.ac.uk";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

if (isset($_COOKIE["makeItAll_id"])) {
    $emp_id = $_COOKIE["makeItAll_id"];
}
$code = strval($_POST["code"]);
$request = "UPDATE users SET user_invite_code = '$code' WHERE user_id = $emp_id";


if ($database->query($request) === TRUE) {
    echo "Success";
  } else {
    echo "Error updating record: " . $request;
  }

mysqli_close($database);
?>