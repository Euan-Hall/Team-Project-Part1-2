<?php
$hostname = "sci-project.lboro.ac.uk";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$project_id = $_POST["project_id"];
$request = "SELECT projects2.project_name, users.user_email, (
	SELECT (	
        SELECT COUNT(tasks.task_id)
        FROM projects2 LEFT JOIN tasks ON projects2.project_id = tasks.task_project_id
        WHERE projects2.project_id = $project_id AND tasks.task_status = 'done' AND tasks.task_id NOT IN 
        (
            SELECT task_subtask.parent_id FROM task_subtask
        )
	) / (
        SELECT COUNT(tasks.task_id)
        FROM projects2 LEFT JOIN tasks ON projects2.project_id = tasks.task_project_id
        WHERE projects2.project_id = $project_id AND tasks.task_id NOT IN 
        (
            SELECT task_subtask.parent_id FROM task_subtask
        )
	) * 100
) as ratio, (
    SELECT COUNT(tasks.task_id) FROM tasks WHERE tasks.task_project_id = $project_id AND tasks.task_id NOT IN 
    (
        SELECT task_subtask.parent_id FROM task_subtask
    )
) as taskno, (
    SELECT COUNT(project_employee.user_id) FROM project_employee WHERE project_employee.project_id = $project_id
) as empno
FROM projects2 LEFT JOIN users ON project_leader_id = users.user_id
WHERE projects2.project_id = $project_id;";
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