<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$email = strval($_POST["email"]);
$password = strval($_POST["password"]);
$username = strval($_POST["name"]);

$request = "INSERT INTO users(user_id, user_email, user_password, user_name, is_manager) VALUES (NULL, '$email', '$password', '$username', 'n')";

if ($database->query($request) === TRUE) {
    echo "Success" . $request;
  } else {
    echo "Error updating record: " . $request;
  }

mysqli_close($database);
?>
