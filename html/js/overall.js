function viewTasks(button) {
	var employeeNode = button.parentNode;
	var employeeName = employeeNode.querySelector(".employee-name").innerHTML.split(' ')[0].toLowerCase() + "-" + employeeNode.querySelector(".employee-name").innerHTML.split(' ')[1].toLowerCase();

	document.getElementById(employeeName).style.display = "flex";
}

function managerTaskAdd(kanbanID) {
	var kanbanDiv = kanbanID.querySelector(".kanban");
	var todoText = kanbanID.querySelector(".dashboard-overlay-input").querySelector("textarea").value;

	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "kanban-item");
	newDiv.innerHTML = "<div class=\"kanban-item-text\"><p><b>"+todoText+"</b></p></div><div class=\"kanban-item-buttons\"><button class=\"kanban-item-moveDeleteButton kanban-item-button\" ,type=\"button\" onclick=\"delete_todoItem_button(this)\"><i class=\"fa-solid fa-trash\"></i></button></div>";
	kanbanDiv.appendChild(newDiv);
}

function create_post() {
	document.getElementById("post-overlay").style.display = "flex";
    document.getElementById("post-overlay-input").focus();
};

function post_cancel_button() {
	document.getElementById("post-overlay").style.display = "none";
};


function filter_posts() {}


function post_break_button() {
	var forumpost = document.getElementById("kanban-forumpost");
	var posttitle = document.getElementById("post-overlay-title").value;
	var contents = document.getElementById("post-overlay-input").value;
	var date = get_formatted_date();
	//var author = 'John Smith';

  if (posttitle!="") {
      var newDiv = document.createElement("div");
      newDiv.setAttribute("class", "kanban-item");
			var arr = "['" + posttitle + "','" + date + "'," + "'John Smith','"+ contents + "']"
      newDiv.innerHTML = '<div onclick="add_href('+arr+')" style="cursor: pointer;" class="kanban-item-text"><p><b>'+posttitle+'</b></p></a><p>John Smith</p></div></div><p class="kanban-date-posted">'+date+'</p>';
			console.log(newDiv.innerHTML);
      forumpost.appendChild(newDiv);
      document.getElementById("post-overlay").style.display = "none";
  } else {
      alert("Please Enter a Valid Input");
  }
	document.getElementById("post-overlay-title").value = "";
  document.getElementById("post-overlay-input").value = "";
	document.getElementById("post-overlay-tag").value = "";
	document.getElementById("post-overlay-subject").value = "";
};

function add_href(postContents){
	location.href="forum-page.html";
	sessionStorage.setItem("postArray", JSON.stringify(postContents));
}


function get_formatted_date() {
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const formattedToday = dd + '/' + mm + '/' + yyyy;
	return formattedToday;
}

function create_reply(){
	var forumpost = document.getElementById("kanban-forumpost");
	var reply = document.createElement("div");
	reply.setAttribute("class", "kanban-item");
	reply.innerHTML = '<div class="kanban-item" id="post-overlay-box-paragraph" style="margin-top: 1rem;"><textarea type="text" id="post-overlay-input" name="post-inline-input"></textarea></div>';
	forumpost.appendChild(reply);
}

function load_data(){
	var postArray = sessionStorage.getItem("postArray").slice(1, -1);
	postArray = postArray.split(',');
	for (var i = 0; i < postArray.length; i++) {
		console.log(postArray[i]);
		postArray[i] = postArray[i].slice(1, -1);
		console.log(postArray[i]);
	}

	document.getElementById('forum-title').innerHTML = '<div class="kanban-title" id="forum-title"><h1><b>'+postArray[0]+'</b></h1></div>';
	console.log(postArray);

	var forumpost = document.getElementById("kanban-forumpost");
	var post = document.createElement("div");
	post.setAttribute("class", "kanban-item");
	post.innerHTML = '<div class="kanban-item-text"><p>'+postArray[3]+'</p></a><p>'+postArray[2]+'</p></div></div><p class="kanban-date-posted">'+postArray[1]+'</p>';
	forumpost.appendChild(post);
	create_reply();

}

function forum_break_button() {
	var forumpost = document.getElementById("kanban-forumpost");
	var contents = document.getElementById("post-overlay-input").value;
	var date = get_formatted_date();
	//var author = 'John Smith';

  if (contents!="") {
			var del = document.getElementById("post-overlay-box-paragraph");
			del.parentNode.parentNode.removeChild(del.parentNode);

      var newDiv = document.createElement("div");
      newDiv.setAttribute("class", "kanban-item");
      newDiv.innerHTML = '<div class="kanban-item-text"><p>'+contents+'</p></a><p>John Smith</p></div></div><p class="kanban-date-posted">'+date+'</p>';
      forumpost.appendChild(newDiv);
			create_reply();
  } else {
      alert("Please Enter a Valid Input");
  }
  document.getElementById("post-overlay-input").value = "";
};

function get_formatted_date() {
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const formattedToday = dd + '/' + mm + '/' + yyyy;
	return formattedToday;
}