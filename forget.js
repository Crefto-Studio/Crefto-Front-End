const forget = document.getElementById('forget');
const appear = document.getElementById('appear');

forget.addEventListener("click", function forget_func() {
    document.getElementById("container").style.display = "none";
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
                            document.getElementById("l").style.display = "none";
                            document.getElementById("p").style.display = "none";
                            document.getElementById("m").style.display = "none";
                            document.getElementById("li").style.display = "none";
                            document.getElementById("mm").innerHTML = "Change your password";
                            document.getElementById("tt").innerHTML = '<i class="fa fa-key icon"></i><input class="input-field" id="password-1" type="password" placeholder="Type your new password" name="password">';
                            document.getElementById("aa").innerHTML = '<i class="fa fa-key icon"></i><input class="input-field" id="password-2" type="password" placeholder="Re-type your new password" name="password">';
                            document.getElementById("btnn").innerHTML = '<br><button id="done">Done</button>';
                            document.getElementById("tt").style.display = "flex";
                           document.getElementById("aa").style.display = "flex";
                           document.getElementById("done").addEventListener("click", () => {
                            window.location.href = "index.html";
                           })
  
                    });

                }

                else {

                    swal("Not valid mail try again! ", {
                        icon: "error",
                    })
                }
            })

    });

})



// show pass
function eye_func(id) {
    var who = id;
    var x = document.getElementById("pass");
    var x2 = document.getElementById("repass");
    var x3 = document.getElementById("logpass");
    
    
    if (who == "eye1") {
        if (x.type === "password") {
            x.type = "text";
            document.getElementById(who).className = "fa fa-eye-slash";

        } else {

            x.type = "password";

            document.getElementById(who).className = "fa fa-eye";

        }
    }

    if (who == "eye2") {
        if (x2.type === "password") {
            x2.type = "text";
            document.getElementById(who).className = "fa fa-eye-slash";

        } else {

            x2.type = "password";

            document.getElementById(who).className = "fa fa-eye";

        }
    }

    if (who == "eye3") {
        if (x3.type === "password") {
            x3.type = "text";
            document.getElementById(who).className = "fa fa-eye-slash";

        } else {

            x3.type = "password";

            document.getElementById(who).className = "fa fa-eye";

        }
    }


}

