<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$parent_id = strval($_POST["parent_id"]);
$child_id = strval($_POST["child_id"]);

$request = "UPDATE task_subtask SET parent_id = $parent_id WHERE child_id = $child_id;";


if ($database->query($request) === TRUE) {
    echo "Success" . $request;
  } else {
    echo "Error updating record: " . $request;
  }

mysqli_close($database);
?>
