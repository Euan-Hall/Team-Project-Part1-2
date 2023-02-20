<?php
$hostname = "localhost";
$username = "team14";
$password = "W05q7hMywF";

$database = mysqli_connect($hostname, $username, $password, "team14");
if (mysqli_connect_errno()) {
  exit();
}

$task_id = $_POST["task_id"];
$request = "SELECT a.task_id, a.task_content, b.user_id as assigned_id, b.user_email as assigned_email, a.task_status, a.task_creation_date, a.task_deadline_date, c.user_email as creator_email, d.user_email as editor_email, a.task_hourneeded,
(
    SELECT COUNT(task_subtask.parent_id) FROM task_subtask WHERE task_subtask.parent_id = $task_id
) as parent,
(
    SELECT task_subtask.parent_id FROM task_subtask WHERE task_subtask.child_id = $task_id
) as child
FROM tasks as a 
LEFT JOIN users as b ON a.task_assigned_user_id = b.user_id
LEFT JOIN users as c ON a.task_creator_id = c.user_id
LEFT JOIN users as d ON a.task_editor_id = d.user_id
WHERE a.task_id=$task_id;";
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
