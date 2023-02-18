$(document).ready(function(){
	loadTasks();
});

function loadTasks(){
	$.ajax({
		url: "php/load_forum.php",
		type: "GET",
		success: function(responseData) {
			responseData.forEach(element => {
				post_create(element.postid, element.title, element.author, element.post_date);
			});
		},
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
	var title = document.getElementById('title');
	var author = document.getElementById('author');
	var date = document.getElementById('date');
	var tag = document.getElementById('tags');

	$.ajax({
		url: "php/get_filter_db.php",
		type: "GET",
		data: {"title":title, "author":author, "date":date},
		success : function(responseData) {
			console.log(responseData);
			// TODO CLEAR WIKI LIST, LIST RETURNED RESOPNSE.
		}
	});
}




function add_href(postContents){
	location.href="forum-page.html";
	sessionStorage.setItem("postArray", JSON.stringify(postContents));
}

function post_create(postid, title, author, date){
	let newPost = document.createElement('div');
	newPost.setAttribute("class", "kanban-item");
	newPost.setAttribute("id", "post-"+postid);
	newPost.innerHTML = "<div class='kanban-item-text'>(<p><b>"+title+"</b></p></a><p>"+author+"</p></div></div<<p class='kanban-date-posted'>"+date+"</p>";
	newPost.innerHTML += '<div class="kanban-item-buttons"><button id="button-"'+postid+' class=kanban-item-moveDeleteButton kanban-item-button icon" type="button" onclick"deleteForumPost(this)><i class ="fa-solid fa-trash"></i></button></div>"';
	document.getElementById('kanban-forumpost').appendChild(newPost);
}

function getAuthor(){
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
	const today = new Date();
	const yyyy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const formattedToday = dd + '/' + mm + '/' + yyyy;
	return formattedToday;
}

function getCookie(name) {
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
	let postID = button.id.split("-")[1];
	$.ajax({
		url:"php/delete_forum_post.php",
		type:"POST",
		data:{"postID":postID},
		success:function(responseData){
			console.log(responseData);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert("Status: " + textstatus); alert("Error: "+ errorThrown);
		}
	});
	document.getElementById("post-"+postID).remove();
}
