<?php
$hostname = "sci-project.lboro.ac.uk";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$task_id = "NULL";
if (!empty($_POST["task_id"])) {
    $task_id = strval($_POST["task_id"]);
}

$task_content = strval($_POST["task_content"]);

$task_project_id = "NULL";
if (!empty($_POST["task_project_id"])) {
    $task_project_id = intval($_POST["task_project_id"]);
}

$task_assigned_user_id  = "NULL";
if (!empty($_POST["task_assigned_user_id"])) {
    $task_assigned_user_id = intval($_POST["task_assigned_user_id"]);
}

$task_creator_id = intval($_POST["task_creator_id"]);
$task_editor_id = intval($_POST["task_editor_id"]);
$task_creation_date = strval($_POST["task_creation_date"]);
$task_deadline_date = strval($_POST["task_deadline_date"]);
$task_hourneeded = intval($_POST["task_hourneeded"]);
$task_status = strval($_POST["task_status"]);

$request = "INSERT INTO tasks(task_id, task_content, task_project_id, task_assigned_user_id, task_creator_id, task_editor_id, task_creation_date, task_deadline_date, task_hourneeded,task_status) VALUES (NULL, '$task_content', $task_project_id, $task_assigned_user_id, $task_creator_id, $task_editor_id, '$task_creation_date', '$task_deadline_date', $task_hourneeded,'$task_status')";


if ($database->query($request) === TRUE) {
    echo "Success";
  } else {
    echo "Error updating record: " . $database->error;
  }

mysqli_close($database);
?>
