$(document).ready(function () {
    $("#taskpage-overlay").hide(); // hides overlay
    loadTasks(); // creates task elements
});

// shows task overlay
function taskOverlay() {
    document.getElementById("createTask-input").focus();
    let today = getDate();
    document.getElementById("createTask-deadline").setAttribute("min", today);
    document.getElementById("createTask-deadline").setAttribute("value", today);
    document.getElementById("createTask-hours").value = 5;
    updateTaskSlider(document.getElementById("createTask-hours").value);
    $("#taskpage-overlay").fadeIn();
    $("#createTask-overlayBox").show();
    $("#invite-overlayBox").hide();
}

// retreives inputs from user and updates the database with new task
function addTask() {
    let id = getCookie("makeItAll_id");
	let content = document.getElementById("createTask-input").value;
    let deadline = document.getElementById("createTask-deadline").value;
    let hoursNeeded = document.getElementById("createTask-hours").value;

    if (content!="") {
        $.ajax({
            url: "php/add_task.php",
            type: "POST",
            data: {"task_id":null, "task_content":content, "task_project_id":null, "task_assigned_user_id":id, "task_creator_id":id, "task_editor_id":id, "task_creation_date":getDate(), "task_deadline_date":deadline, "task_hourneeded":hoursNeeded,"task_status":"todo"},
            success: function(responseData) {
                console.log(responseData);
            }
        })
        window.location.reload();
        $("#taskpage-overlay").fadeOut();
    } else {
        alert("Please Enter a Valid Input");
    }
    document.getElementById("createTask-input").value = "";

    window.location.reload();
};

// shows invite code ovelay
function inviteOverlay() {
    $("#taskpage-overlay").fadeIn();
    $("#createTask-overlayBox").hide();
    $("#invite-overlayBox").show();
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
            console.log(responseData);
        }
    })
}

// removes the overlay
function removeOverlay() {
	$("#taskpage-overlay").fadeOut();
};

// creates a website elements to represent each task designated to a user
function createTask(status, fromProject, text, allInfo) {
    let newTask = document.createElement("div");
    newTask.setAttribute("class", "kanban-item");
    newTask.setAttribute("draggable","true");
    newTask.setAttribute("ondragstart","drag(event)");
    let taskID = allInfo.split(",")[0];
    newTask.setAttribute("id", "task-"+taskID);
    allInfo = allInfo.split(",");
    allInfo.shift();
    allInfo.shift();
    var AssignedCreated = allInfo[0] + "  " + allInfo[1];
    var LastEdits = allInfo[2];
    var Created = allInfo[3];
    var Deadline = allInfo[4];
    var TimeNeed = allInfo[5];
    text = text.toUpperCase();

    if (fromProject !== null) {
        newTask.classList.add("delegated");
        newTask.innerHTML = "<div id=\"displayAll\", class=\"kanban-item-text\"><p><b>Task: </b><b>"+text+"</b><br><br><br><b>"+Deadline+"</b></p></div><br><div id=\"displayAll2\", class=\"kanban-item-buttons\"><p id=\"displayAll2\"><b>"+AssignedCreated+"</b><br><b>"+LastEdits+"</b><br><b>"+Created+"</b><br><b>"+Deadline+"</b><br><b>"+TimeNeed+"</b></p></div>";
    } else {
        newTask.classList.add("personal");
        newTask.innerHTML = "<div id=\"displayAll\", class=\"kanban-item-text\"><p><b>Task: </b><b>"+text+"</b><br><br><br><b>"+Deadline+"</b></p></div><p><div id=\"displayAll2\", class=\"kanban-item-buttons\"><p id=\"displayAll3\"><b>"+AssignedCreated+"</b><br><b>"+LastEdits+"</b><b>"+Created+"</b><br><b>"+Deadline+"</b><br><b>"+TimeNeed+"</b></p></div><div class=\"kanban-item-buttons\"><button id='button-"+taskID+"', class=\"kanban-item-moveDeleteButton kanban-item-button icon\" ,type=\"button\" onclick=\"delete_todoItem_button(this)\"><i class=\"fa-solid fa-trash\"></i></button></div>";
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
function delete_todoItem_button(button) {
    let taskID = button.id.split("-")[1];
    $.ajax({
        url: "php/delete_task.php",
        type: "POST",
        data: {"task_id":taskID},
        success: function (responseData) {
            console.log(responseData);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })
    document.getElementById("task-"+taskID).remove();
};

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
            console.log(responseData);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })

    updateCounters();
}

// retrieves all tasks that a user has been assigned, and then creates website elements to represent them
function loadTasks() {
    $.ajax({
        url: "php/get_tasks.php",
        type: "GET",
        success: function(responseData) {
            responseData.forEach(element => {
                let contents = element.task_id.toString()+", "+element.task_content+", assigned: "+element.task_assigned_user_id.toString()+", creator: "+element.task_creator_id.toString()+", last edited by: "+element.task_editor_id.toString()+", created: "+element.task_creation_date+", deadline: "+element.task_deadline_date+", hours: "+element.task_hourneeded.toString();
                if (element.task_project_id !== null) {
                    contents = contents + ", project: " + element.task_project_id;
                }
                createTask(element.task_status, element.task_project_id, element.task_content, contents);
            });
        },
        dataType: "json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })
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
    let displayVal = document.getElementById("taskHours");
    displayVal.textContent = x;
}