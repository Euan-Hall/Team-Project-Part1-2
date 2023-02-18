var existing_users = []; // array containing the emails of existing users
var valid_codes = []; // array containing valid invite codes

$(document).ready(function() {

    //Retrieves an array of objects containing the email and invite code of a user and pushes the to respective array.
    $.ajax({
        url: "php/get_existing_users.php",
        type: "GET",
        success: function(responseData) {
            responseData.forEach(element => {
                existing_users.push(element.user_email.toLowerCase()); // replaces short hyphens with long ones since the database automatically coverts them
                valid_codes.push(element.user_invite_code)
            })
        },
        dataType: "json"
    });
});

/**Checks if field contains a secure, and valid password.
 *  - called when user types in  the password field
*/
function passwordCheck() {
    $("#account-page-password-area").slideDown(); // Shows div for alerting the user about password details

    var password = document.getElementById("password").value; // gets input in password field

    const lowercaseLetterPattern = /[a-z]/g;
    if (password.match(lowercaseLetterPattern)) {
        // turns this div green if password contains lowercase letters
        $("#lower-letter").animate({
            backgroundColor : "#a5fc94"
        }, {"duration":400, "queue": false});
    } else {
        // turns this div red if password does not contain lowercase letters
        $("#lower-letter").animate({
            backgroundColor : "#fc9494"
        }, {"duration":400, "queue": false});
    }

    const uppercaseLetterPattern = /[A-Z]/g;
    if (password.match(uppercaseLetterPattern)) {
        // turns this div green if password contains uppercase letters
        $("#upper-letter").animate({
            backgroundColor : "#a5fc94"
        }, {"duration":400, "queue": false});
    } else {
        // turns this div red if password does not contain uppercase letters
        $("#upper-letter").animate({
            backgroundColor : "#fc9494"
        }, {"duration":400, "queue": false});
    }

    const numberPattern = /[0-9]/g;
    if (password.match(numberPattern)) {
        // turns this div green if password contains numbers
        $("#number").animate({
            backgroundColor : "#a5fc94"
        }, {"duration":400, "queue": false});
    } else {
        // turns this div red if password does not contain numbers
        $("#number").animate({
            backgroundColor : "#fc9494"
        }, {"duration":400, "queue": false});
    }

    if(password.length >= 8) {
        // turns this div green if password is 8 characters or longer
        $("#length").animate({
            backgroundColor : "#a5fc94"
        }, {"duration":400, "queue": false});
    } else {
        // turns this div red if password is not 8 characters or longer
        $("#length").animate({
            backgroundColor : "#fc9494"
        }, {"duration":400, "queue": false});
    }

    password_match_check(); // check if the input now matches the password confirmation field
}

// First drops down div showing the user if their password matches, then calls function to check if password field and password confirmation field
function password_match() {
    $("#account-page-passwordmatch-area").slideDown();

    password_match_check(); // check if password now matches the password confirmation field
}

// Checks if password matches the password confirmation field
function password_match_check() {
    var password = document.getElementById("password").value; // gets user input for password
    var confirm_password = document.getElementById("confirm_password").value; // gets user input for password confirmation
    
    if (password == confirm_password && password != "") {
        // turns this div green if password match and are not empty
        $("#match").animate({
            backgroundColor : "#a5fc94"
        }, {"duration":400, "queue": false});
        // also changes the text with animations
        $("#match-text").fadeOut(200, function() {
            document.getElementById("match-text").innerHTML = "<b>Passwords match!</b>";
            $("#match-text").fadeIn(200);
        });
    } else {
        // turns this div red if password do not match or are empty
        $("#match").animate({
            backgroundColor : "#f2fc94"
        }, {"duration":400, "queue": false});
        // also changes the text with animations
        $("#match-text").fadeOut(200, function() {
            document.getElementById("match-text").innerHTML = "<b>Passwords do not match.</b>";
            $("#match-text").fadeIn(200);
        });
    }
}

/*  Checks if the all inputs fields are valid, then updates the database with the new users data if so
    - called when users attemtps to create an account
    - if returns true, this will forward the page to login.html
    - if false, user not created and page not forwarded 
*/
function verify_details() {
    var email = document.getElementById("email").value.replaceAll('-','\u2010'); //database converts character 0x2d to \u2010, so convert the opposite way to check 
    const emailRegEx = /^[\w-\.]+@make‐it‐all.co.uk$/;
    var password = document.getElementById("password").value;
    const passwordRegEx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    var confirm_password = document.getElementById("confirm_password").value;
    var code = document.getElementById("code").value;
    var name = document.getElementById("name").value;

    alert(name);

    var valid;
    if (RegExp(emailRegEx).test(email) && !existing_users.includes(email) && RegExp(passwordRegEx).test(password) && password==confirm_password && password!="" && password.length>=8 && valid_codes.includes(code)) {
        valid = true;

        //updates database to create the user
        $.ajax({
            url: "php/create_account.php",
            type: "POST",
            data: {"email":email, "password":password, "name":name},
            success: function(responseData) {
                console.log(responseData);
            }
        });
    } else {
        valid = false;
        if (!email.match(emailRegEx) || existing_users.includes(email)) {
            $("#account-page-email-area").slideDown();
            //slides down div that will inform user that the email is invalid

            if (!email.match(emailRegEx)) {
                // if the format is incorrect, then the text in the div is updated to reflect this
                $("#email-text").fadeOut(200, function() {
                    document.getElementById("email-text").innerHTML = "<b>This is not a valid email.</b>";
                    $("#email-text").fadeIn(200);
                })
            } else {
                // if the user already exists, then the text in the div is updated to reflect this
                $("#email-text").fadeOut(200, function() {
                    document.getElementById("email-text").innerHTML = "<b>This user already exists.</b>";
                    $("#email-text").fadeIn(200);
                })
            }
        } 
        
        if (!valid_codes.includes(code)) {
            //slides down div that will inform user that the code is invalid
            $("#account-page-code-area").slideDown();
        }
        
        passwordCheck() // checks if passwords is valid
        password_match(); // checks if password field and password confiramtion field match
    }
    return valid;
}