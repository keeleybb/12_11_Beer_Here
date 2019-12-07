

  // Or with jQuery

  $(document).ready(function(){
    $('.sidenav').sidenav();
  });

$(document).ready(function(){
      //initialize carousel
  $(".carousel").carousel()

     //initialize carousel full slider
  $(".carousel.carousel-slider").carousel({fullWidth:true});

//initialize slider
  $(".slider").slider();

  });


function initMap() {
  // The location of Uluru
  var uluru = { lat: 39.7392, lng: -104.9903 };
  // The map, centered at Uluru
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru
  });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: uluru, map: map });
}

