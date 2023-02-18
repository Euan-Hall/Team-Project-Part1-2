<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

if (isset($_COOKIE["makeItAll_id"])) {
    $emp_id = $_COOKIE["makeItAll_id"];
}
$request = "SELECT projects2.project_id, projects2.project_name, projects2.project_leader_id, project_training.training_name
FROM projects2 LEFT JOIN project_training ON projects2.project_id = project_training.project_id;";
$result = $database->query($request);
$dataArray = array();

if (mysqli_num_rows($result) > 0){
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
        $dataArray[] = $row; //append $row to the end of the $allDataArray array
    }
}

echo json_encode($dataArray);
mysqli_close($database);
?>
