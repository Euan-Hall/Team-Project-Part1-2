$(document).ready(function(){
	// When fully loaded, load the posts from the DB.
	loadForum();

	if (!Boolean(getCookie("makeItAll_manager"))) {
		$("#create-post-button").hide();
	}
});

function loadForum(){
	// Loads posts from database and displays them on the document
	Array.from(document.getElementsByClassName("kanban-item-forum")).forEach(task => {
        task.remove();
    })
	$.ajax({
		url: "php/load_forum.php",
		type: "GET",
		success: function(responseData) {
			responseData.forEach(element => {
				post_create(element.postid, element.title, element.author, element.post_date);
			});		},
		dataType: 'json'
	});
}

function create_post() {
	// Unhide overlay
	document.getElementById("post-overlay").style.display = "flex";
    	//document.getElementById("post-overlay-input").focus();
};

function post_cancel_button() {
	// Hides the overlay
	document.getElementById("post-overlay").style.display = "none";
};

function filter_posts() {
	// Get contents of each input
	var title = document.getElementById('title').value;
	var author = document.getElementById('author').value;
	var date = document.getElementById('date').value;
	var tag = document.getElementById('tags').value;
	
	console.log(title, author, date, tag);
	$.ajax({
		url: "php/get_post_filter.php",
		type: "GET",
		data: {"title":title, "author":author, "date":date},
		success : function(responseData) {
			console.log("Response: ", responseData);
			clearPosts();
			responseData.forEach(element => {
				post_create(element.post_id, element.title, element.author, element.post_date);
			});
		},
		dataType: 'json'
	});
}

function clear_posts() {
	// Removes posts from document
	document.getElementById("create_post").remove();
	document.getElementById("kanban-forumpost").remove();
	let forumPost = document.createElement('div');
	forumPost.setAttribute("class", "kanban-list");
	forumPost.setAttribute("id", "kanban-forumpost");
	document.getElementById("kanban-forum").appendChild(forumPost);

	// Add button back to document
	let button = document.createElement('div');
	button.setAttribute("class", "kanban-add");
	button.setAttribute("id", "create_post");
	button.innerHTML = '<button id="create-post-button" class="kanban-button-forum", type="button", onclick="create_post()">Create Post</button>';
	document.getElementById("kanban-forum").appendChild(button);
}

function reset_posts() {
	clear_posts();
	loadForum();
}

function add_href(postID){
	// Adds link to individual posts and adds postID to local storage.
	location.href="forumPage.html";
	sessionStorage.setItem("postID", postID);
}

function post_create(postid, title, author, date){
	// Creates new div
	let newPost = document.createElement('div');
	newPost.setAttribute("class", "kanban-item-forum");
	newPost.setAttribute("id", "post-"+postid);
	newPost.innerHTML = "<div onclick=add_href("+postid+") style='cursor: pointer;' class='kanban-item-forum-text'><p><b>"+title+"</b></p></a><p>"+author+"</p></div></div><div class='kanban-item-forum-date'>"+date+"</div>";
	newPost.innerHTML += '<div class=".kanban-item-forum-button"><button id="button-'+postid+'" class="moveEditButton kanban-item-button icon" type="button" onclick"editPost(this)"><i class="fa-solid fa-gear"></i></button></div> <div class=".kanban-item-forum-buttons"><button id="button-'+postid+'" class="kanban-item-moveDeleteButton kanban-item-button icon" type="button" onclick="deleteForumPost(this)"><i class ="fa-solid fa-trash"></i></button></div>';
	document.getElementById('kanban-forumpost').appendChild(newPost);

	// CLEAR CONTENTS
	document.getElementById("post-overlay-tag").innerHTML = "";
	document.getElementById("post-overlay-title").innerHTML = "";
}

function getAuthor(){
	// Gets Author email from author id
	$.ajax({
		url: "php/get_login_db.php",
		type: "GET",
		success: function(responseData){
			let author = responseData;
		}
	})
	return author;
}


function post_add_button() {
	// Get post contents
	var forumpost = document.getElementById("kanban-forumpost");
	var posttitle = document.getElementById("post-overlay-title").value;
	var contents = "-" //quill.getContents();
	var date = get_formatted_date();
	var authorID = getCookie("makeItAll_id");	
	var author = getAuthor();
	var tags = document.getElementById("post-overlay-tag").value;

	// Connect to SQL
  	if (posttitle!= "" && contents != "" && author != "") {
		$.ajax({
			url: "php/create_post_db.php",
			type: "POST",
			data: {"title":posttitle, "author_id":authorID, "post_date":date, "contents":contents, "tags":tags},
			success: function(responseData) {
				console.log(responseData);
			}
		});
      		post_cancel_button()
			loadForum();
	} else {
      		alert("Please Enter a Valid Input");
  	}
	
	// Clear contents of inputs
	document.getElementById("post-overlay-title").value = "";
 	document.getElementById("post-overlay-input").value = "";
	document.getElementById("post-overlay-tag").value = "";
	document.getElementById("post-overlay-subject").value = "";
};

function get_formatted_date() {
	// Get date
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();
	
	// Add leading 0s
	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const formattedToday = dd + '/' + mm + '/' + yyyy;
	return formattedToday;
}

function getCookie(name) {
    // Gets cookies
    let cookies = document.cookie.split("; ");
    cookieVal = null
    cookies.forEach(element => {
        if (element.toLowerCase().includes(name.toLowerCase())) {
            cookieVal = element.split("=")[1].toString();
        };
    });
    return cookieVal;
}

function deleteForumPost(button) {
	// Delete forum post from postID
	let postID = button.id.split("-")[1];
	console.log(postID);
	$.ajax({
		url:"php/delete_forum_post.php",
		type:"POST",
		data:{"post_id":postID},
		success:function(responseData){
			console.log("Deleted", postID);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert("Status: " + textStatus); alert("Error: "+ errorThrown);
		}
	});

	// Remove from document
	document.getElementById("post-"+postID).remove();
}

function editPost(button){
	// SHOW OVERLAY
	document.getElementById("post-overlay").style.display = "flex";
	
	// GET POST DETAILS
	let postID = button.id.split("-")[1];
	$.ajax({
		url:"php/get_forum_post.php",
		type:"GET",
		success:function(responseData){
			document.getElementById("title").innerHTML = responseData.title;
			document.getElementById("author").innerHTML = getAuthor(responseData.author);
			document.getElementById("date").innerHTML = responseData.post_date;
			document.getElementById("create_post").setAttribute('onclick', 'finishPost()'); 
		},
		dataType: "json"
	});
}

function getTags(postID){
	let dataArray = [];
	$.ajax({
		url:"php/get_tags.php",
		type:"GET",
		success:function(responseData){
			responseData.forEach(element => push(element));
		}
	});
	return dataArray;
}

function finishPost(postID){
	document.getElementById("post-overlay").style.display = "none";
	let date = document.getElementById("date").value;
	let author = document.getElementById("author").value;
	let title = document.getElementById("title").value;
	let tags = getTags(postID);
	$.ajax({
		url:"php/edit_post.php",
		type:"POST",
		data:{"title":title, "date":date, "author":author, "tags":tags},
		success:function(responseData){
			console.log("Success");
		}
	});
	document.getElementById("create_post").setAttribute('onclick', 'create_post()');
}
