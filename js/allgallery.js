window.onload=dis_all_posts();
function dis_all_posts(){
    var text = "";
    fetch("http://www.api.crefto.studio/api/v1/posts")
		.then(response => response.json())
		.then(json => {
			console.log(json);
			if (json.status == "success") {
				for(let i=0;i<json.results;i++){
                   text+= '<div class="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">';
                   text+= '<div class="rounded overflow-hidden">';
                   text+= '<div class="position-relative overflow-hidden">';
                   text+= '<img class="img-fluid w-100" src="https://crefto.s3.eu-central-1.amazonaws.com/posts/'+ json.data.posts[i].postImg+'" alt="">';
                   text+= '<div class="portfolio-overlay">';
                   text+= '<a class="btn btn-square btn-outline-light mx-1" href="https://crefto.s3.eu-central-1.amazonaws.com/posts/'+json.data.posts[i].postImg +'" data-lightbox="portfolio"><i class="fa fa-eye"></i></a>';
                    text+='</div>';
                    text+='</div>';
                    text+= '<div class="bg-light p-4">';
                    text+= '<p class="text-primary fw-medium mb-2">'+json.data.posts[i].type+'</p>';
                    text+= '</div>';
                    text+='</div>';
                    text+= '</div>';
                }	
        document.getElementById('gal').innerHTML+=text;
              }
        })
}