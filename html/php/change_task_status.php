<?php
$hostname = "sci-project.lboro.ac.uk";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$task_id = strval($_POST["task_id"]);
$task_status = strval($_POST["task_status"]);

$request = "UPDATE tasks SET task_status = '$task_status' WHERE task_id = $task_id;";


if ($database->query($request) === TRUE) {
    echo "Success" . $request;
  } else {
    echo "Error updating record: " . $request;
  }

mysqli_close($database);
?>