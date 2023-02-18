<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$task_id = strval($_POST["task_id"]);
$task_content = strval($_POST["task_content"]);
$task_assigned_user_id = strval($_POST["task_assigned_user_id"]);
$task_editor_id = strval($_POST["task_editor_id"]);
$task_deadline = strval($_POST["task_deadline"]);
$task_hours = strval($_POST["task_hours"]);

$request = "UPDATE tasks SET task_content = '$task_content', task_assigned_user_id = $task_assigned_user_id, task_editor_id=$task_editor_id, task_deadline_date = '$task_deadline', task_hourneeded = $task_hours WHERE task_id = $task_id;";


if ($database->query($request) === TRUE) {
    echo "Success" . $request;
  } else {
    echo "Error updating record: " . $request;
  }

mysqli_close($database);
?>
