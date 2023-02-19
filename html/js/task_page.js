$(document).ready(function () {
    $("#taskpage-overlay").hide(); // hides overlay
    loadTasks(); // creates task elements
});

// shows task overlay
function createTaskOverlay() {
    $("#taskpage-overlay").fadeIn();
    $("#createTask-overlayBox").show();
    $("#taskInfo-overlayBox").hide();
    $("#invite-overlayBox").hide();
    $("#editTask-overlayBox").hide();

    document.getElementById("createTask-input").focus();
    let today = getDate();
    document.getElementById("createTask-deadline").setAttribute("min", today);
    document.getElementById("createTask-deadline").setAttribute("value", today);
    document.getElementById("createTask-hours").value = 5;
    updateTaskSlider(document.getElementById("createTask-hours").value);
    $("#taskpage-overlay").fadeIn();
    $("#createTask-overlayBox").show();
    $("#taskInfo-overlayBox").hide();
    $("#invite-overlayBox").hide();
}

// retreives inputs from user and updates the database with new task
function addTask() {
    let id = getCookie("makeItAll_id");
	let content = document.getElementById("createTask-input").value;
    let deadline = document.getElementById("createTask-deadline").value;
    let hoursNeeded = document.getElementById("taskCreateHours").value;

    if (content!="") {
        $.ajax({
            url: "php/add_task.php",
            type: "POST",
            data: {"task_id":null, "task_content":content, "task_project_id":null, "task_assigned_user_id":id, "task_creator_id":id, "task_editor_id":id, "task_creation_date":getDate(), "task_deadline_date":deadline, "task_hourneeded":hoursNeeded,"task_status":"todo"},
            success: function(responseData) {
                console.log(responseData);
            }
        })
        loadTasks()
        removeOverlay();
    } else {
        alert("Please Enter a Valid Input");
    }
    document.getElementById("createTask-input").value = "";
};

// shows invite code ovelay
function inviteOverlay() {
    $("#taskpage-overlay").fadeIn();
    $("#createTask-overlayBox").hide();
    $("#taskInfo-overlayBox").hide();
    $("#invite-overlayBox").show();
    $("#editTask-overlayBox").hide();
};

// generates a invite code
function generateCode() {
    let code = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // all possible characters in code
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength)) + " "; // chooses a random character from possible characters
        counter += 1;
    }
    code[11] = ""; // removes space from last character in code string
    $("#code").html(code); // shows user the code

    // updates database with user code
    $.ajax({
        url: "php/generate_code.php",
        type: "POST",
        data: {"code":code.replaceAll(" ","")},
        success: function(responseData) {
        }
    })
}

function taskInfoOverlay(t) {
    $("#taskpage-overlay").fadeIn();
    $("#editTask-overlayBox").hide();
    $("#createTask-overlayBox").hide();
    $("#taskInfo-overlayBox").show();
    $("#invite-overlayBox").hide();

    taskID = t.id.split("-")[1];
    if (t.classList.contains("delegated")) {
        $("#task-details-buttons").hide();
    } else {
        $("#task-details-buttons").show();
    }

    $.ajax({
        url:"php/get_task_information.php",
        type:"POST",
        data: {"task_id":taskID},
        success: function(responseData) {
            let task = responseData[0]
            $("#emp-task-details-box > div").animate({opacity: 0}, {"duration":200, "queue": false, "complete": function() {
                $("#task-details-content").html(taskID+" - "+task.task_content);
                $("#task-details-assigned").html(task.assigned_email);
                $("#task-details-status").html(task.task_status);
                $("#task-details-created").html("Cr: "+task.task_creation_date);
                $("#task-details-deadline").html("Dl: "+task.task_deadline_date);
                $("#task-details-creator").html("Cr: "+task.creator_email);
                $("#task-details-editor").html("Ed: "+task.editor_email);
                $("#task-details-hours").html("Len (hours): "+task.task_hourneeded);
                $("#emp-task-details-box > div").animate({opacity: 1}, {"duration":200, "queue": false});
            }});
        },
        dataType:"json"
    });
}

function editTaskOverlay() {
    let taskID = document.getElementById("task-details-content").textContent.split(" - ")[0];

    // retrive task informations and sets current input values to current information
    $.ajax({
        url:"php/get_task_information.php",
        type:"POST",
        data: {"task_id":taskID},
        success: function(responseData) {
            let task = responseData[0]
            $("#editTask-content").val(task.task_content);
            let today = getDate();
            document.getElementById("editTask-deadline").setAttribute("min", today);
            document.getElementById("editTask-deadline").setAttribute("value", task.task_deadline_date);
            document.getElementById("editTask-hours").value = task.task_hourneeded;
            updateTaskSlider(task.task_hourneeded);
        },
        dataType:"json"
    });

    $("#taskInfo-overlayBox").fadeOut("fast", function() {
        $("#editTask-overlayBox").fadeIn("fast");
    });
}

// retrieves inputs then updates database
function editTask() {
    let userID = getCookie("makeItAll_id");
    let taskID = document.getElementById("task-details-content").textContent.split(" - ")[0];
	let content = document.getElementById("editTask-content").value;
    let deadline = document.getElementById("editTask-deadline").value;
    let hoursNeeded = document.getElementById("taskEditHours").value;

    // updates database
    if (content!="") {
        $.ajax({
            url: "php/update_task.php",
            type: "POST",
            data: {"task_id":taskID, "task_content":content, "task_assigned_user_id":userID, "task_editor_id":userID, "task_deadline":deadline, "task_hours":hoursNeeded},
            success: function(responseData) {
            }
        })
        loadTasks();
        removeOverlay();
    } else {
        alert("Please Enter a Valid Input");
    }
}

function returnOverlayEdit() {
    $("#editTask-overlayBox").fadeOut("fast", function() {
        $("#taskInfo-overlayBox").fadeIn("fast");
    });
}

// removes the overlay
function removeOverlay() {
	$("#taskpage-overlay").fadeOut();
};

// retrieves all tasks that a user has been assigned, and then creates website elements to represent them
function loadTasks() {
    Array.from(document.getElementsByClassName("kanban-item")).forEach(task => {
        task.remove();
    })
    $.ajax({
        url: "php/get_tasks.php",
        type: "GET",
        success: function(responseData) {
            responseData.forEach(element => {
                createTask(element.task_id, element.task_status, element.task_project_id, element.task_content, element.task_deadline_date, element.task_hourneeded);
            });
        },
        dataType: "json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })
}

// creates a website elements to represent each task designated to a user
function createTask(taskID, status, fromProject, text, deadline, hoursNeeded) {
    let newTask = document.createElement("div");
    newTask.setAttribute("class", "kanban-item");
    newTask.setAttribute("draggable","true");
    newTask.setAttribute("ondragstart","drag(event)");
    newTask.setAttribute("id", "task-"+taskID);
    newTask.setAttribute("onclick", "taskInfoOverlay(this)")

    const today = new Date();
    const deadlineDate = new Date(deadline+"T17:00:00");
    let hoursLeft = (deadlineDate.getTime() - today.getTime()) / 1000 / 60 / 60;

    if (hoursNeeded>hoursLeft) {
        newTask.innerHTML = '<div class="kanban-item-text">'+text+'</div><div class="kanban-item-deadline overdue">Deadline: '+deadline+'</div>';
    } else {
        newTask.innerHTML = '<div class="kanban-item-text">'+text+'</div><div class="kanban-item-deadline">Deadline: '+deadline+'</div>';
    }

    if (fromProject !== null) {
        newTask.classList.add("delegated");
    } else {
        newTask.classList.add("personal");
    }

    let kanbanColumn;
    if (status == "todo") {
        kanbanColumn = document.getElementById("kanban-todolist");
    } else if (status == "doing") {
        kanbanColumn = document.getElementById("kanban-doinglist");
    } else if (status == "done") {
        kanbanColumn = document.getElementById("kanban-donelist");
    }
    kanbanColumn.appendChild(newTask);
    updateCounters();
}

// removes a task from webpage and database
function deleteTask() {
    let taskID = document.getElementById("task-details-content").textContent.split(" - ")[0];

    $.ajax({
        url: "php/delete_task.php",
        type: "POST",
        data: {"task_id":taskID},
        success: function (responseData) {
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })

    document.getElementById("task-"+taskID).remove();
    removeOverlay();
}

//Counts how many tasks have delegated or are personal.
function personal_or_delegated(element) {
    let children = element.childNodes;
    let personal = 0;
    let project = 0;
    for (let i=0; i<children.length; ++i) {
        if (children[i].classList.contains("personal")) {
            personal = personal+1;
        } else if (children[i].classList.contains("delegated")) {
            project = project+1;
        }
    }
    let amountList = [personal,project];
    return amountList;
}


// Updates the sidebar counts nased on the number of tasks.
function updateCounters() {
    let todo = document.getElementById("kanban-todolist");
    let todoCounts = personal_or_delegated(todo);
    let doing = document.getElementById("kanban-doinglist");
    let doingCounts = personal_or_delegated(doing);
    let done = document.getElementById("kanban-donelist");
    let doneCounts = personal_or_delegated(done);

    //upadtes personal task counters
    document.getElementById("sidebar-todo-counter-personal").firstChild.innerHTML = todoCounts[0];
    document.getElementById("sidebar-doing-counter-personal").firstChild.innerHTML = doingCounts[0];
    document.getElementById("sidebar-done-counter-personal").firstChild.innerHTML = doneCounts[0];
    document.getElementById("sidebar-total-counter-personal").firstChild.innerHTML = todoCounts[0]+doingCounts[0]+doneCounts[0];

    //upadtes delecate task counters
    document.getElementById("sidebar-todo-counter-delegated").firstChild.innerHTML = todoCounts[1];
    document.getElementById("sidebar-doing-counter-delegated").firstChild.innerHTML = doingCounts[1];
    document.getElementById("sidebar-done-counter-delegated").firstChild.innerHTML = doneCounts[1];
    document.getElementById("sidebar-total-counter-delegated").firstChild.innerHTML = todoCounts[1]+doingCounts[1]+doneCounts[1];
};

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// when a task is moved, this updates the database according to where the user drops it
function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let obj = document.getElementById(data);
    ev.target.appendChild(obj);

    let new_status;
    if (ev.target.id=="kanban-todolist") {
        new_status="todo";
    } else if (ev.target.id=="kanban-doinglist") {
        new_status="doing";
    } else if (ev.target.id=="kanban-donelist") {
        new_status="done";
    }

    $.ajax({
        url: "php/change_task_status.php",
        type: "POST",
        data: {"task_id":data.split("-")[1], "task_status":new_status},
        success: function (responseData) {
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })

    updateCounters();
}

function filterPersonal(b) {
    if (b.classList.contains("tabs-button-personal-active")) {
        b.classList.remove("tabs-button-personal-active");
        $(".kanban-item.delegated").show();
    } else {
        b.classList.add("tabs-button-personal-active");
        $(".kanban-item.delegated").hide();
        $(".kanban-item.personal").show();
    }
    document.getElementById("tabs-button-delegated").classList.remove("tabs-button-delegated-active");
}

function filterDelegated(b) {
    if (b.classList.contains("tabs-button-delegated-active")) {
        b.classList.remove("tabs-button-delegated-active");
        $(".kanban-item.personal").show();
    } else {
        b.classList.add("tabs-button-delegated-active");
        $(".kanban-item.personal").hide();
        $(".kanban-item.delegated").show();
    }
    document.getElementById("tabs-button-personal").classList.remove("tabs-button-personal-active");
}


// gets the value of a cookie by name
function getCookie(name) {
    let cookies = document.cookie.split("; ");
    cookieVal = null
    cookies.forEach(element => {
        if (element.toLowerCase().includes(name.toLowerCase())) {
            cookieVal = element.split("=")[1].toString();
        };
    })
    return cookieVal;
}

// gets todays date
function getDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
        
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

//updates number associated with slider
function updateTaskSlider(x) {
    let displayVal = document.getElementById("taskCreateHours");
    let displayEditVal = document.getElementById("taskEditHours");
    displayVal.value = x;
    displayEditVal.value = x;
}