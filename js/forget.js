const forget = document.getElementById('forget');
const appear = document.getElementById('appear');

forget.addEventListener("click", function forget_func() {
    document.getElementById("container").style.display= "none";

    document.getElementById('appear').style.display="block";
    document.getElementById('p').style.display="block";
    document.getElementById('m').style.display="block";
    document.getElementById('li').style.display="block";
    document.getElementById('mm').style.display="block";
    document.getElementById('tt').style.display="block";
    document.getElementById('aa').style.display="block";
    document.getElementById('btnn').style.display="block";
    document.getElementById('l').style.display="block";
    document.getElementById('pi').style.display="block";
    document.getElementById('mi').style.display="block";
    document.getElementById('back_button').style.display="block";
    document.getElementById('lock_img').style.display="block";

    //  container.style.opacity = "0";
    appear.style.opacity = "1";
    document.getElementById("appear").innerHTML = "Reset Your Password";
    document.getElementById("p").innerHTML = '<br>' + "Enter your email address and we will send you a code to reset your password";
    document.getElementById("m").innerHTML = '<br><input type="text"placeholder="Email address" id="mailforget"/>';
    document.getElementById("l").innerHTML = '<br><button class="btn btn-secondary py-sm-3 px-sm-5 rounded-pill me-3" id="send_btn">Send me</button>';

    document.getElementById("send_btn").addEventListener("click", () => {

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

                    swal("Check Your Email Please", {
                        icon: "success",
                     }).then(back_func());
                     //.then(function () {
                    //         document.getElementById("l").style.display = "none";
                    //         document.getElementById("p").style.display = "none";
                    //         document.getElementById("m").style.display = "none";
                    //         document.getElementById("li").style.display = "none";
                    //         document.getElementById("mm").innerHTML = "Change your password";
                    //         document.getElementById("tt").innerHTML = '<i class="fa fa-key icon"></i><input class="input-field" id="password-1" type="password" placeholder="Type your new password" name="password">';
                    //         document.getElementById("aa").innerHTML = '<i class="fa fa-key icon"></i><input class="input-field" id="password-2" type="password" placeholder="Re-type your new password" name="password">';
                    //         document.getElementById("btnn").innerHTML = '<br><button id="done">Done</button>';
                    //         document.getElementById("tt").style.display = "flex";
                    //        document.getElementById("aa").style.display = "flex";
                    //        document.getElementById("done").addEventListener("click", () => {
                    //         window.location.href = "index.html";
                    //        })
  
                    // });

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


//go back
function back_func(){
    document.getElementById('appear').style.display="none";
    document.getElementById('p').style.display="none";
    document.getElementById('m').style.display="none";
    document.getElementById('li').style.display="none";
    document.getElementById('mm').style.display="none";
    document.getElementById('tt').style.display="none";
    document.getElementById('aa').style.display="none";
    document.getElementById('btnn').style.display="none";
    document.getElementById('l').style.display="none";
    document.getElementById('pi').style.display="none";
    document.getElementById('mi').style.display="none";
    document.getElementById('back_button').style.display="none";
    document.getElementById('lock_img').style.display="none";
    document.getElementById("container").style.display = "block";
}


//alert login before services
var notification;
var container = document.querySelector('#notification-container');
var visible = false;
var queue = [];

function createNotification() {
    notification = document.createElement('div');
    var btn = document.createElement('button');
    var title = document.createElement('div');
    var msg = document.createElement('div');
    btn.className = 'notification-close';
    title.className = 'notification-title';
    msg.className = 'notification-message';
    btn.addEventListener('click', hideNotification, false);
    notification.addEventListener('animationend', hideNotification, false);
    notification.addEventListener('webkitAnimationEnd', hideNotification, false);
    notification.appendChild(btn);
    notification.appendChild(title);
    notification.appendChild(msg);
}

function updateNotification(type, title, message) {
    notification.className = 'notification notification-' + type;
    notification.querySelector('.notification-title').innerHTML = title;
    notification.querySelector('.notification-message').innerHTML = message;
}

function showNotification(type, title, message) {
    if (visible) {
        queue.push([type, title, message]);
        return;
    }
    if (!notification) {
        createNotification();
    }
    updateNotification(type, title, message);
    container.appendChild(notification);
    visible = true;
}

function hideNotification() {
    if (visible) {
        visible = false;
        container.removeChild(notification);
        if (queue.length) {
            showNotification.apply(null, queue.shift());
        }
    } 
}

function alertphoto(elem){
    if (document.cookie.indexOf('AuthTokenCookie=') != -1){
        window.location.href='my photo editor/editor.html';
        // elem.href="my photo editor/editor.html";
    }
    else{
      setTimeout(showNotification.bind(null, 'error', 'Error!', 'You must log in first.'),500);
    }
}

function alertfingo(){
    if (document.cookie.indexOf('AuthTokenCookie=') != -1){
        window.location.href='gaugan/gaugan.html';
    }
    else{
      setTimeout(showNotification.bind(null, 'error', 'Error!', 'You must log in first.'),500);
    }
}

function alertdraw(){
    if (document.cookie.indexOf('AuthTokenCookie=') != -1){
        window.location.href='AutoDraw2/drawing-app-js-master/index.html';
    }
    else{
      setTimeout(showNotification.bind(null, 'error', 'Error!', 'You must log in first.'),500);
    }
}
