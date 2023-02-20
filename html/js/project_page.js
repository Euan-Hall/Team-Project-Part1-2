$(document).ready(function () {
    // Shows and hides all parts of the overlay where revelant
    $("#addEmp-overlay-box").hide();
    $("#managerNewTask-overlay-box").hide();
    $("#EditTask-overlay-box").hide();
    $("#managerEditProject-overlay-box").hide();
    $("#newProject-overlay-box").hide();
    $("#project-overlay").hide();
    $("#tab-project").show();
    $("#emp-tab").css("background-color","var(--background-colour-shadow)");
    $("#tab-emp").hide();
    
    loadProjects(); // creates all divs that pertain to projects

    // adds an "add project" button if the user is a manager
    if (Boolean(getCookie("makeItAll_manager"))) {
        $("#article").html("<div class='sidebar'><button id='new-project-button' onclick='newProjectOverlay()'><i class='fa-solid fa-plus'></i></button></div><div class='kanban', id='kanban-project'><div class='kanban-title'><h1 id='title'><b>Your Projects.</b></h1></div><div id='kanban-project-list'></div></div>");
    } else {
        $("#edit-project-button").hide();
    }
});

// Queries the database to access all projects, and create website elements to represent them, that the user has access to
function loadProjects() {
    if (!Boolean(getCookie("makeItAll_manager"))) {
        // if the user is not a manager, then we query the database with the users id to aquire the projects they are associated with
        $.ajax({
            url:"php/get_projects.php",
            type:"POST",
            data:{"user_id":getCookie("makeItAll_id")},
            success: function(responseData) {
                let projects = []; // array containing objects that contain project information
               	let projectIDs = [] // array containing IDs of projects
                console.log(typeof responseData);
		responseData.forEach(element => {
                    if (!projectIDs.includes(element.project_id)) {
                        projectIDs.push(element.project_id);

                        const project = {
                            project_id:element.project_id,
                            project_name:element.project_name,
                            project_leader_id:element.project_leader_id,
                            training_name:[element.training_name]
                        };

                        projects.push(project);
                    } else {
                        // this query will have an entry per training name, so this makes sure a projecy is not duplicated
                        projects.forEach(p => {
                            if (p.project_id == element.project_id) {
                                p.training_name.push(element.training_name);
                            }
                        });
                    }
                });
                projects.forEach(element => {
                    createProject(element.project_id, element.project_name, element.project_leader_id, element.training_name); // creates website elements to display projects
                });
            },
            dataType:"json"
        });
    } else {
        // if the user is a manager, then we query the database to return all projects
        $.ajax({
            url:"php/get_projects_manager.php",
            type:"GET",
            success: function(responseData) {
                let projects = [];
                let projectIDs = []
                responseData.forEach(element => {
                    if (!projectIDs.includes(element.project_id)) {
                        projectIDs.push(element.project_id);

                        const project = {
                            project_id:element.project_id,
                            project_name:element.project_name,
                            project_leader_id:element.project_leader_id,
                            training_name:[element.training_name]
                        };

                        projects.push(project);
                    } else {
                        projects.forEach(p => {
                            if (p.project_id == element.project_id) {
                                p.training_name.push(element.training_name);
                            }
                        });
                    }
                });
                projects.forEach(element => {
                    createProject(element.project_id, element.project_name, element.project_leader_id, element.training_name);
                });
            },
            dataType:"json"
        });
    }
}

// creates website elements to dipslay project details
function createProject(projectID, projectName, leaderID, trainingArray) {
    let project = document.createElement("div");
    project.setAttribute("class", "kanban-item-project");
    project.setAttribute("id","proj-"+projectID+"-"+leaderID);
    let projectList = document.getElementById("kanban-project-list");
    projectList.appendChild(project);

    let training = "<ul>";
    trainingArray.forEach(t => {
        if (t != null) {
            training += "<li>"+t+"</li>"
        }
    });
    training+="</ul>";

    if (getCookie("makeItAll_id")==leaderID || Boolean(getCookie("makeItAll_manager"))) {
        // if the user is a manger or is the team leader of this project, then add an additional "projects settings" button
        project.innerHTML = "<div class='project-title'><h2><b>"+projectName+"</b></h2></div><div class='project-boxes'><button class='project-manager-button icon setting' onclick='projectOverlay(this)'><i class='fa-solid fa-gear fa-lg'></i></button></div><div class='project-training'><div class='project-training-content'><p>Training Required:</p>"+training+"</div></div><div class='project-progressBars'><div class='progressBar project', id='bar-"+projectID+"'></div></div>";
    } else {
        project.innerHTML = "<div class='project-title'><h2><b>"+projectName+"</b></h2></div><div class='project-boxes'></div><div class='project-training'><div class='project-training-content'><p>Training Required:</p>"+training+"</div></div><div class='project-progressBars'><div class='progressBar project', id='bar-"+projectID+"'></div></div>";
    }

    updateProgressBar(projectID); // updates the progress bar associated with this project
}

function updateProgressBar(projectID) {
    let bar = document.getElementById("bar-"+projectID); // gets corrent div element

    // queries the database to aquire the ratio on done tasks to all tasks on a particular project
    $.ajax({
        url:"php/project_progressbar.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            bar.style.setProperty("--width", responseData[0].ratio) // updates width of bar, using a percentage value
        },
        dataType:"json"
    });
}

// shows overlay for a project
function projectOverlay(e) {
    clearDetails(); // clears task details

    // shows correct overlay elements
    $("#projectInfo-overlay-box").show();
    $("#addEmp-overlay-box").hide();
    $("#managerNewTask-overlay-box").hide();
    $("#EditTask-overlay-box").hide();
    $("#managerEditProject-overlay-box").hide();
    $("#newProject-overlay-box").hide();
    $("#manager-task-details-box > div").css({
        opacity: 0
    });

    let projectID = e.parentNode.parentNode.id.split("-")[1];
    document.cookie = "project_id="+projectID; // sets project id in cookies
    let leaderID = e.parentNode.parentNode.id.split("-")[2];
    document.cookie = "leader_id="+leaderID; // sets leader of project id in cookies

    let empButtons = "";
    // creates an button for each employee on the project
    $.ajax({
        url:"php/get_emps_on_project.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            responseData.forEach(element => {
                if (element.user_id != leaderID) {
                    empButtons += "<div class='emp-tab-button', id='emp-"+element.user_id+"', onclick='filterEmp(this)'><p>"+element.user_id+" - "+element.user_email+"</p><button class='icon emp-tab-button-delete', onclick='removeEmpFromProject(this)'><i class='fa-solid fa-trash'></i></button></div>";
                } else {
                    empButtons = "<div class='emp-tab-button leader', id='emp-"+element.user_id+"', onclick='filterEmp(this)'><p>"+element.user_id+" - "+element.user_email+"</p></div>" + empButtons;
                }
            });
            $("#employee-tabs-inner").html(empButtons);
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });

    // creates buttons for each task on project
    let projectTasks="";
    $.ajax({
        url:"php/get_tasks_on_project.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            responseData.forEach(element => {
                let details = element.task_id.toString()+", "+element.task_content+", assigned: "+nullCheck(element.task_assigned_user_id).toString()+", creator: "+element.task_creator_id.toString()+", last edited by: "+element.task_editor_id.toString()+", created: "+element.task_creation_date+", deadline: "+element.task_deadline_date+", hours: "+element.task_hourneeded.toString();
                projectTasks += "<button id='task-"+element.task_id+"' class='manager-task-list-item task-active', onclick='showDetails(this)'><p>"+element.task_content+"</p><span class='deets', style='display: none;'>"+details+"</span></button>";
            });
            $("#manager-task-list").html(projectTasks);
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });

    // sets overlay elemetns to show project's information
    $.ajax({
        url:"php/get_project_information.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            let info = responseData[0];
            $("#overlay-title").html(info.project_name);
            $("#overlay-email").html(info.user_email);
            document.getElementById("overlay-bar").style.setProperty("--width", info.ratio)
            $("#overlay-taskNo").html(info.taskno);
            $("#overlay-empNo").html(info.empno);
        },
        dataType: "json"
    });

    $("#project-overlay").fadeIn();
}

// removes overlay
function removeOverlay() {
	$("#project-overlay").fadeOut();
};

// opens tabs
function openTab(tab) {
    if (tab=="project") {
        $("#tab-emp").slideUp("fast", function() {
            $("#tab-project").slideDown();
        });
        $("#project-tab").css("background-color","white");
        $("#emp-tab").css("background-color","var(--background-colour-shadow)");
    } else {
        $("#tab-project").slideUp("fast", function() {
            $("#tab-emp").slideDown();
        });
        $("#project-tab").css("background-color","var(--background-colour-shadow)");
        $("#emp-tab").css("background-color","white");
    }
}

// filters tasks based on emp id
function filterEmp(e) {
    let tasks = Array.from(document.getElementsByClassName("deets")); // gets all buttons for task

    if (Array.from(e.classList).includes("emp-active")) { // if de-selecting
        e.classList.remove("emp-active");

        tasks.forEach(d => {
            d.parentNode.classList.add("task-active");
            d.parentNode.classList.remove("invisible");
            document.getElementById("emp-bar").style.setProperty("--width", 0)
        });
    } else {
        let children = Array.from(e.parentNode.childNodes); // all tasks
        children.forEach(b => {
            b.classList.remove("emp-active");
        })
        e.classList.add("emp-active");

        let emp_id = e.textContent.split(" - ")[0];

        tasks.forEach(d => {
            if (d.textContent.split(", ")[2].split(": ")[1] == emp_id) { // if the task is assigned to that user, make it visable
                d.parentNode.classList.add("task-active");
                d.parentNode.classList.remove("invisible");
            } else {
                d.parentNode.classList.remove("task-active");
                d.parentNode.classList.add("invisible");
            }
        });

        // shows allocation of tasks to user
        let projectID = getCookie("project_id");
        $.ajax({
            url:"php/emp_ratio.php",
            type:"POST",
            data:{"emp_id":emp_id, "project_id":projectID},
            success: function(responseData) {
                console.log(responseData);
                let info = responseData[0];
                document.getElementById("emp-bar").style.setProperty("--width", info.ratio)
            },
            dataType: "json"
        });
    }

    // then filters visible tasks on saerch bar
    let searchbar = document.getElementById("manager-task-name");
    filterTasks(searchbar);
}

// filters task based on search bar input
function filterTasks(t) {
    let searchVal = t.value;
    
    let tasks = Array.from(document.getElementsByClassName("deets"));
    tasks.forEach(d => {
        if (d.parentNode.childNodes[0].textContent.toLowerCase().startsWith(searchVal.toLowerCase()) && Array.from(d.parentNode.classList).includes("task-active")) { // if task starts with input and is active (task belongs to selected employee)
            d.parentNode.classList.remove("invisible");
        } else {
            d.parentNode.classList.add("invisible");
        }
    });
}

// removes employee from project
function removeEmpFromProject(e) {
    let empID = e.parentNode.id.split("-")[1];
    let projectID = getCookie("project_id");

    $.ajax({
        url:"php/remove_emp_from_project.php",
        type:"POST",
        data: {"project_id":projectID, "user_id":empID},
        success: function(responseData) {}
    });

    e.parentNode.remove();
}

// switches overlay to the "add emmployee to project" overlay
function addEmpOverlay() {
    let projectID = getCookie("project_id");
    let empAddButtons = "";

    // creates a button for employees not on a project 
    $.ajax({
        url:"php/get_emps_not_on_project.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            responseData.forEach(element => {
                empAddButtons += "<div class='emp-tab-button', id='empAdd-"+element.user_id+"', onclick='selectAddEmp(this)'><p>"+element.user_id+" - "+element.user_email+"</p></div>";
            });
            $("#add-emp-select-inner").html(empAddButtons);
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });

    // fades out current overlay, fades in corrent overlays
    $("#projectInfo-overlay-box").fadeOut("fast", function() {
        $("#addEmp-overlay-box").fadeIn("fast");
    });
}

// returns overlay to main overlay page
function returnOverlayAdd() {
    $("#addEmp-overlay-box").fadeOut("fast", function() {
        $("#projectInfo-overlay-box").fadeIn("fast");
    });
}

// adds class to all employee buttons that are to be added to a project, such that we can use the class selector to select all of these employees
function selectAddEmp(e) {
    if (Array.from(e.classList).includes("empAdd-active")) {
        e.classList.remove("empAdd-active");
    } else {
        e.classList.add("empAdd-active");
    }
}

 // retrives all employees that are to added and then updatyes the database to add them to the current project
function addEmpToProject() {
    let empsToAdd = Array.from(document.getElementsByClassName("empAdd-active"));
    empsToAdd.forEach(emp => {
        let empID = emp.id.split("-")[1];
        let projectID = getCookie("project_id");
        console.log(projectID, empID);
        $.ajax({
            url:"php/add_emp_to_project.php",
            type:"POST",
            data: {"project_id":projectID, "user_id":empID},
            success: function(responseData) {
                console.log(responseData);
            }
        });
    });

    removeOverlay();
}

// clears the task details, used when overlay opened
function clearDetails() {
    $("#man-details-content").html("");
    $("#man-details-assigned").html("");
    $("#man-details-status").html("");
    $("#man-details-created").html("");
    $("#man-details-deadline").html("");
    $("#man-details-creator").html("");
    $("#man-details-editor").html("");
    $("#man-details-hours").html("");
}

// shows details on a task when user clicks on it
function showDetails(e) {
    let allDetails = e.childNodes[1].textContent.split(", ");
    let id = allDetails[0];

    $.ajax({
        url:"php/get_task_information.php",
        type:"POST",
        data: {"task_id":id},
        success: function(responseData) {
            let task = responseData[0]
            $("#manager-task-details-box > div").animate({opacity: 0}, {"duration":200, "queue": false, "complete": function() {
                if (task.child !== null) {
                    $("#man-details-content").html(id+" - "+task.task_content+"<br>This is a subtask of the task with ID: "+task.child);
                } else if (task.parent > 0) {
                    $("#man-details-content").html(id+" - "+task.task_content+"<br>This task has "+task.parent+" subtasks.");
                } else {
                    $("#man-details-content").html(id+" - "+task.task_content);
                }
                $("#man-details-assigned").html(task.assigned_email);
                $("#man-details-status").html(task.task_status);
                $("#man-details-created").html("Cr: "+task.task_creation_date);
                $("#man-details-deadline").html("Dl: "+task.task_deadline_date);
                $("#man-details-creator").html("Cr: "+task.creator_email);
                $("#man-details-editor").html("Ed: "+task.editor_email);
                $("#man-details-hours").html("Len (hours): "+task.task_hourneeded);
                $("#manager-task-details-box > div").animate({opacity: 1}, {"duration":200, "queue": false});
            }});
        },
        dataType:"json"
    });
}

// removes task from database
function deleteTask() {
    let ID = document.getElementById("man-details-content").textContent.split(" - ")[0];

    $.ajax({
        url: "php/delete_task.php",
        type: "POST",
        data: {"task_id":ID},
        success: function (responseData) {
            console.log(responseData);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    })

    let taskItems = Array.from(document.getElementsByClassName("manager-task-list-item"));
    taskItems.forEach(t => {
        let tID = t.id.split("-")[1];
        if (ID == tID) {
            t.remove();
        }
    });
}

// switches to "creare task" overlay
function newTaskOverlay() {
    $("#EditTask-overlay-box").hide();
    
    document.getElementById("manager-newTask-content").focus();
    let today = getDate();
    document.getElementById("manager-newTask-deadline").setAttribute("min", today);
    document.getElementById("manager-newTask-deadline").setAttribute("value", today);
    document.getElementById("manager-newTask-hours").value = 5;
    updateTaskSlider(document.getElementById("manager-newTask-hours").value); // updates number associated with slider
    let selections = "<option value='null'></option>";
    let projectID = getCookie("project_id");
    // creates an option for all users on task so the task can be assigned
    $.ajax({
        url:"php/get_emps_on_project.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            responseData.forEach(element => {
                selections += "<option value='"+element.user_id+"'>"+element.user_email+"</option>";
            });
            $("#manager-newTask-assign").html(selections);
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        }
    });
    // fades out projecy information overlay, and then fades in the correct one 
    $("#projectInfo-overlay-box").fadeOut("fast", function() {
        $("#managerNewTask-overlay-box").fadeIn("fast");
    });
}

// returns to project information overlay from new task overlay
function returnOverlayNew() {
    $("#managerNewTask-overlay-box").fadeOut("fast", function() {
        $("#projectInfo-overlay-box").fadeIn("fast");
    });
}

// retrieves user inputs and creates new task
function addTaskToProject() {
    let userID = getCookie("makeItAll_id");
    let projectID = getCookie("project_id");
    let assignedID = document.getElementById("manager-newTask-assign").value;
    // if no emp chosen, then sets option to null
    if (assignedID == "null") {
        assignedID = null;
    }
	let content = document.getElementById("manager-newTask-content").value;
    let deadline = document.getElementById("manager-newTask-deadline").value;
    let hoursNeeded = document.getElementById("taskNewHours").value;

    if (content!="") {
        $.ajax({
            url: "php/add_task.php",
            type: "POST",
            data: {"task_id":null, "task_content":content, "task_project_id":projectID, "task_assigned_user_id":assignedID, "task_creator_id":userID, "task_editor_id":userID, "task_creation_date":getDate(), "task_deadline_date":deadline, "task_hourneeded":hoursNeeded,"task_status":"todo"},
            success: function(responseData) {
                console.log(responseData);
            }
        })
        removeOverlay();
    } else {
        alert("Please Enter a Valid Input");
    }
    document.getElementById("manager-newTask-content").value = "";
    $("#managerNewTask-overlay-box").hide();
};

// switches overlay to edit task overlay
function editTaskOverlay() {
    $("#managerNewTask-overlay-box").hide();
    let taskID = document.getElementById("man-details-content").textContent.split(" - ")[0];

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

            // create a selection option for all emps on a project
            let selections = "<option value='null'></option>";
            let projectID = getCookie("project_id");
            $.ajax({
                url:"php/get_emps_on_project.php",
                type:"POST",
                data:{"project_id":projectID},
                success: function(responseData) {
                    responseData.forEach(element => {
                        if (element.user_id == task.assigned_id) {
                            selections += "<option selected='selected' value='"+element.user_id+"'>"+element.user_email+"</option>";
                        } else {
                            selections += "<option value='"+element.user_id+"'>"+element.user_email+"</option>";
                        }
                    });
                    $("#editTask-assign").html(selections);
                },
                dataType:"json",
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                } 
            });

            // create a selection option for all tasks on a project
            let selectionsParent = "<option value='null'></option>";
            $.ajax({
                url:"php/get_tasks_on_project.php",
                type:"POST",
                data:{"project_id":projectID},
                success: function(responseData) {
                    responseData.forEach(element => {
                        if (element.task_id == task.child) {
                            selectionsParent += "<option selected='selected' value='"+element.task_id+"'>"+element.task_id+"-"+element.task_content+"</option>";
                        } else {
                            if (!(element.task_id == task.task_id) && element.parent_id == null) {
                                selectionsParent += "<option value='"+element.task_id+"'>"+element.task_id+"-"+element.task_content+"</option>";
                            }
                        }
                    });
                    $("#editTask-parent").html(selectionsParent);
                },
                dataType:"json",
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                } 
            });
        },
        dataType:"json"
    });

    //fades out project info overlay, fades in edit task overlay
    $("#projectInfo-overlay-box").fadeOut("fast", function() {
        $("#EditTask-overlay-box").fadeIn("fast");
    });
}

// returns edit task overlay to project info overlay
function returnOverlayEdit() {
    $("#EditTask-overlay-box").fadeOut("fast", function() {
        $("#projectInfo-overlay-box").fadeIn("fast");
    });
}

// retrieves inputs then updates database
function editTaskOnProject() {
    let userID = getCookie("makeItAll_id");
    let taskID = document.getElementById("man-details-content").textContent.split(" - ")[0];
    let assignedID = document.getElementById("editTask-assign").value;
    // if selection is empty, then set to null
    if (assignedID == "null") {
        assignedID = null;
    }
	let content = document.getElementById("editTask-content").value;
    let deadline = document.getElementById("editTask-deadline").value;
    let hoursNeeded = document.getElementById("taskEditHours").value;
    let parentID = document.getElementById("editTask-parent").value;
    if (parentID == "null") {
        parentID = null;
    }

    // updates database
    if (content!="") {
        $.ajax({
            url: "php/update_task.php",
            type: "POST",
            data: {"task_id":taskID, "task_content":content, "task_assigned_user_id":assignedID, "task_editor_id":userID, "task_deadline":deadline, "task_hours":hoursNeeded},
            success: function(responseData) {
                console.log(responseData);
            }
        })

        if (parentID != null) {
            $.ajax({
                url: "php/update_subtask.php",
                type: "POST",
                data: {"parent_id":parentID,"child_id":taskID},
                success: function(responseData) {
                    console.log(responseData);
                }
            })

            $.ajax({
                url: "php/add_subtask.php",
                type: "POST",
                data: {"parent_id":parentID,"child_id":taskID},
                success: function(responseData) {
                    console.log(responseData);
                }
            })
        } else {
            $.ajax({
                url: "php/delete_subtask.php",
                type: "POST",
                data: {"parent_id":parentID,"child_id":taskID},
                success: function(responseData) {
                    console.log(responseData);
                }
            })
        }
        removeOverlay();
    } else {
        alert("Please Enter a Valid Input");
    }
}

// switches to edit project overlay
function editProjectOverlay() {
    let projectID = getCookie("project_id");
    $.ajax({
        url:"php/get_project_information.php",
        type:"POST",
        data:{"project_id":projectID},
        success: function(responseData) {
            console.log(responseData[0]);
            let info = responseData[0];
            $("#manager-editProject-name").val(info.project_name);
        },
        dataType: "json"
    });

    let selections = "<option value='null'></option>";
    $.ajax({
        url:"php/get_existing_users.php",
        type:"POST",
        success: function(responseData) {
            responseData.forEach(element => {
                selections += "<option value='"+element.user_id+"'>"+element.user_email+"</option>";
            });
            $("#manager-editProject-assign").html(selections);
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });


    $("#projectInfo-overlay-box").fadeOut("fast", function() {
        $("#managerEditProject-overlay-box").fadeIn("fast");
    });
}

// retrieves input and updates database
function editProjectDetails() {
    let projectID = getCookie("project_id");
    let projectName = $("#manager-editProject-name").val();
    let leaderID = $("#manager-editProject-assign").val();
    if (leaderID == "null") {
        leaderID = null;
    }
    $.ajax({
        url:"php/update_project.php",
        type:"POST",
        data:{"project_id":projectID, "project_name":projectName, "project_leader_id":leaderID},
        success: function(responseData) {
            console.log(responseData);
        },
        dataType:"json"
    });

    window.location.reload();
}

// returns  to project info overlay from edit overlay
function returnOverlayEditProject() {
    $("#managerEditProject-overlay-box").fadeOut("fast", function() {
        $("#projectInfo-overlay-box").fadeIn("fast");
    });
}

//shows overlay for new project creation
function newProjectOverlay() {
    $("#projectInfo-overlay-box").hide();
    $("#addEmp-overlay-box").hide();
    $("#managerNewTask-overlay-box").hide();
    $("#EditTask-overlay-box").hide();
    $("#managerEditProject-overlay-box").hide();
    $("#newProject-overlay-box").show();

    let selections = "<option value='null'></option>";
    $.ajax({
        url:"php/get_existing_users.php",
        type:"POST",
        success: function(responseData) {
            responseData.forEach(element => {
                selections += "<option value='"+element.user_id+"'>"+element.user_email+"</option>";
            });
            $("#manager-newProject-assign").html(selections);
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });

    $("#project-overlay").fadeIn("fast");
}

// uodates database with new project
function createNewProject() {
    let projectName = $("#manager-newProject-name").val();
    let leaderID = $("#manager-newProject-assign").val();
    console.log(projectName, leaderID);

    if (projectName != "") {
        $.ajax({
            url:"php/create_project.php",
            type:"POST",
            data:{"project_name":projectName, "project_leader_id":leaderID},
            success: function(responseData) {
                console.log(responseData);
            },
            dataType:"json"
        });
        window.location.reload();
    } else {
        alert("Please enter a valid name!");
    }
} 

// upadtes number associayed with slider
function updateTaskSlider(x) {
    let displayValNew = document.getElementById("taskNewHours");
    let displayValEdit = document.getElementById("taskEditHours");
    displayValNew.value = x;
    displayValEdit.value = x;
}

// gets cookies by name
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

//checks if input is null, sets to empty string if so
function nullCheck(x) {
    if (x == null) {
        return "";
    } else {
        return x;
    }
}
