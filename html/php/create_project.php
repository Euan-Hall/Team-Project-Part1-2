<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$project_name = strval($_POST["project_name"]);
$project_leader_id = intval($_POST["project_leader_id"]);
$request = "INSERT INTO projects2(project_id, project_name, project_leader_id) VALUES (NULL, '$project_name', $project_leader_id)";


if ($database->query($request) === TRUE) {
    echo "Success " . $request;
  } else {
    echo "Error updating record: " . $request;
  }

mysqli_close($database);
?>
