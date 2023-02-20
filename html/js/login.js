let validLoginArray = []; // an array containing objects with all users ids, emails and passwords 
let managers = []; // an array containing the ids of managers

//queries the database to retrieve existing user data
$(document).ready(function () {
  $.ajax({
    url: "php/login_page_db.php",
    type: "GET",
    success: function(responseData) {
       responseData.forEach(element => {
        let x = element.user_email;
        x = x.replaceAll('\u2010','-');
        let y = element.user_password;
        let details = [element.user_id, x.trim(), y.trim()];
        validLoginArray.push(details)

        if (element.is_manager == 'y') {
          managers.push(element.user_id);
        }
      });
      console.log(validLoginArray);
      console.log(managers);
    },
    dataType: "json",
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      alert("Status: " + textStatus); alert("Error: " + errorThrown); 
    }
  })
});


/*Checks if login credentials are correct
   - will return true if credentials are valid, allowing the form action that will forward user to actual website
   - else returns false and alerts user about invalid credentials
*/
function validateLogin() {
    clear_login(); // resets cookies
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let valid = false;
    let id;
    // checks inputted email and password against existing users
    validLoginArray.forEach(element => {
      if (email==element[1] && password==element[2]) {
        valid = true;
        id = element[0];
      } 
    })

    if (valid==false) {
      alert("Incorrect Email/Password");
      return false;
    }

    if (managers.includes(id)) {
      document.cookie = "makeItAll_manager=true";
    }
    document.cookie = "makeItAll_id="+id.toString();
}

// clears cookies for the system
function clear_login() {
  document.cookie = "makeItAll_manager=; makeItAll_id="
}
