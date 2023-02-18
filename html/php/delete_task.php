<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$task_id = strval($_POST["task_id"]);
$request = "DELETE FROM tasks WHERE task_id = $task_id;";


if ($database->query($request) === TRUE) {
    echo "Success" . $request;
  } else {
    echo "Error updating record: " . $database->error;
  }

mysqli_close($database);
?>
