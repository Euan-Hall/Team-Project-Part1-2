<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$project_id = $_POST["project_id"];
$request = "SELECT users.user_id, users.user_email
FROM users
WHERE users.user_id NOT IN (
	SELECT users.user_id
	FROM users LEFT JOIN project_employee ON project_employee.user_id = users.user_id
	WHERE project_employee.project_id = $project_id OR users.user_id = (
		SELECT projects2.project_leader_id
    	FROM projects2
    	WHERE projects2.project_id = $project_id
	)
);";
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
