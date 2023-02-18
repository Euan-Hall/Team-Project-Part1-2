<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$project_id = $_POST["project_id"];
$emp_id = $_POST["emp_id"];
$request = "SELECT 
(
    SELECT COUNT(task_id)
    FROM tasks
    WHERE task_project_id = $project_id AND task_assigned_user_id = $emp_id
) 
/
(
    SELECT COUNT(task_id)
    FROM tasks
    WHERE task_project_id = $project_id
)
* 100 as ratio;";
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
