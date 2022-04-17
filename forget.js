const forget = document.getElementById('forget');
const appear = document.getElementById('appear');

//  container.style.opacity = "0";
appear.style.opacity = "1";
document.getElementById("appear").innerHTML = "Reset Your Password";
document.getElementById("p").innerHTML = '<br>' + "Enter your email address and we will send you a code to reset your password";
document.getElementById("m").innerHTML = '<br><input type="text"placeholder="Email address" id="mailforget"/>';
document.getElementById("l").innerHTML = '<br><button>Send me';

document.getElementById("l").addEventListener("click", () => {

    //api
    fetch("http://www.api.crefto.studio/api/v1/users/forgotPassword", {
        method: "POST",

        body: JSON.stringify({
            "email": document.getElementById('mailforget').value,
        }),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

        .then(response => response.json())

        .then(json => {
            console.log(json)
            if (json.status == "success") {

                swal("Code Sent Successfully ", {
                    icon: "success",
                }).then(function () {
                    // container.style.opacity = "0";
                    appear.style.opacity = "0";
                    //document.getElementById("p").style.opacity="0";
                    //document.getElementById("m").style.opacity="0";
                    document.getElementById("l").style.display = "none";
                    document.getElementById("p").innerHTML = '<br>' + "Enter The Code";
                    document.getElementById("m").innerHTML = '<br><input type="text">';
                    document.getElementById("li").innerHTML = '<br><button>Verify';
                    document.getElementById("li").addEventListener("click", () => {
                        document.getElementById("p").style.display = "none";
                        document.getElementById("m").style.display = "none";
                        document.getElementById("li").style.display = "none";
                        document.getElementById("mm").innerHTML = "Change your password";
                        document.getElementById("tt").innerHTML = '<i class="fa fa-key icon"></i><input class="input-field" id="password-1" type="password" placeholder="Type your new password" name="password">';
                        document.getElementById("aa").innerHTML = '<i class="fa fa-key icon"></i><input class="input-field" id="password-2" type="password" placeholder="Re-type your new password" name="password">';
                        document.getElementById("btnn").innerHTML = '<br><button id="done">Done</button>';
                        document.getElementById("tt").style.display = "flex";
                        document.getElementById("aa").style.display = "flex";

                    });
                });

            }

            else {

                swal("Not valid mail try again! ", {
                    icon: "error",
                })
            }
        })

});


