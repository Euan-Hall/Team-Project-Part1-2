<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$project_id = $_POST["project_id"];
$request = "SELECT (	
    SELECT COUNT(tasks.task_id)
    FROM projects2 LEFT JOIN tasks ON projects2.project_id = tasks.task_project_id
    WHERE projects2.project_id = $project_id AND tasks.task_status = 'done'
) / (
	SELECT COUNT(tasks.task_id)
    FROM projects2 LEFT JOIN tasks ON projects2.project_id = tasks.task_project_id
    WHERE projects2.project_id = $project_id     
) * 100 as ratio;";
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
