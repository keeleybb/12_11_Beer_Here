var state;
var breweries = [];

var $loading = $("#loadingDiv").hide();
$(document)
  .ajaxStart(function() {
    $loading.show();
  })
  .ajaxStop(function() {
    $loading.hide();
  });

function searchKickOff(city) {
  //Set city and state equal to whatever is returned from search
  //Set off google map to go to that location
  //Recenter the map??
  //Start getting Data from OpenDB
  var queryURL =
    "https://api.openbrewerydb.org/breweries?by_city=" +
    city +
    "&by_state=" +
    state +
    "&page=1&per_page=50";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(async function(response) {
    console.log(city);
    console.log(queryURL);
    console.log("Open DB Data: ", response);
    //Error handling needs to happen here.
    for (i = 0; i < response.length; i++) {
      if (
        response[i].brewery_type != "planning" &&
        response[i].latitude != null
      ) {
        var breweryName = response[i].name;
        var breweryLat = response[i].latitude;
        var breweryLon = response[i].longitude;
        var breweryPhone = response[i].phone;
        if (breweryPhone > 0) {
          var formattedPhone =
            breweryPhone.substr(0, 3) +
            "-" +
            breweryPhone.substr(3, 3) +
            "-" +
            breweryPhone.substr(6, 4);
        } else {
          formattedPhone = "No phone number";
        }

        //AJAX QUERY FOR GOOGLE
        var queryURLGoogle =
          "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
          breweryName +
          "+" +
          city +
          "+" +
          state +
          "&inputtype=textquery&fields=photos,geometry,formatted_address,name,opening_hours,rating,place_id&key=AIzaSyBdbsiqFxjAUt8-qUuCt4dsHTdnnJSJ3iU";

        var a = await $.ajax({
          url: queryURLGoogle,
          method: "GET"
        });
        var googleBreweryName = a.candidates[0].name;
        var googleBreweryAddress = a.candidates[0].formatted_address;
        var googleBreweryRating = a.candidates[0].rating;
        // console.log(a);

        var brewery = {
          breweryName: breweryName,
          breweryLat: breweryLat,
          breweryLon: breweryLon,
          bgoogleBreweryName: googleBreweryName,
          googleBreweryAddress: googleBreweryAddress,
          googleBreweryRating: googleBreweryRating,
          formattedPhone: formattedPhone
        };
        breweries.push(brewery);
      }
    }

    if (breweries.length > 0) {
      //Sort breweries by rating
      breweries.sort(function compareNumbers(a, b) {
        return b.googleBreweryRating - a.googleBreweryRating;
      });
      // console.log(breweries);
      //Send breweries to be added to page
      breweries.map(callPage);
      //End
    } else {
      alert("Try Another City");
    }
  });
}

function callPage({
  breweryName,
  googleBreweryName,
  googleBreweryAddress,
  googleBreweryRating,
  breweryLat,
  breweryLon,
  formattedPhone
}) {
  //Add to search results to page
  var breweryp = $("<li>").html(
    '<i class="material-icons circle green">local_drink</i>' +
      '<span class="title">' +
      breweryName +
      "</span>" +
      "<p>" +
      googleBreweryAddress +
      "<br />" +
      formattedPhone +
      '</p><a href="#!" class="secondary-content" style="text-align: center;"><i class="material-icons">grade</i><br>' +
      googleBreweryRating +
      "</a>"
  );
  $(breweryp).attr("class", "collection-item avatar");

  $("#search-results").append(breweryp);

  // Create a marker for each brewery
  var newBrewery = new google.maps.Marker({
    position: {
      lat: parseFloat(breweryLat),
      lng: parseFloat(breweryLon)
    },
    map: map,
    title: googleBreweryName
  });
}

//On click call new map - Kick Off getting data
$("#find-beer").on("click", function() {
  var city = $("#city-input")
    .val()
    .trim();
  // console.log(city);
  breweries = [];
  $("#search-results").empty();
  searchKickOff(city);
});

$("#state-option").on("change", function(e) {
  // console.log(e.target.options[e.target.selectedIndex].text);
  state = e.target.options[e.target.selectedIndex].text;
  console.log(state, "State Var");
});