window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('img');
          img.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }

          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
         
      }
  });
});

document.getElementById('submit').addEventListener('click', function () {
    swal("Your information updated successfully ", {
        icon: "success",
    }).then(function () {
        window.location.href = "about.html";
    })
})


