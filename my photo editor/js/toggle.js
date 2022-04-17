var x = document.getElementById('clone_tool');
var y = document.getElementById('action_attributes');
var z = document.getElementById('gradient_tool');
function toggle() {
    if (!x.classList.contains('active') && !z.classList.contains('active')) {
        y.style.display = 'none';
    }
    else {
        y.style.display = 'block';
    }
}
var col = document.getElementById('sec_col');
function toggle_bar() {
    if (col.style.opacity == 0) {
        col.style.opacity = 1;
    }
    else {
        col.style.opacity = 0;
    }
    
}

