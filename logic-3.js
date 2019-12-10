var city;
var state = "colorado";
var breweries = [];

function searchKickOff(city) {
  //Set city and state equal to whatever is returned from search
  //Set off google map to go to that location
  //Recenter the map??
  //Start getting Data from OpenDB
  var queryURL =
    "https://api.openbrewerydb.org/breweries?by_city=" +
    city +
    "&page=1&per_page=50";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(city);
    console.log(queryURL);
    console.log("Open DB Data: ", response);
    for (i = 0; i < response.length; i++) {
      if (
        response[i].brewery_type != "planning" &&
        response[i].latitude != null
      ) {
        var breweryName = response[i].name;
        var breweryLat = response[i].latitude;
        var breweryLon = response[i].longitude;
        var breweryPhone = response[i].phone;
        var formattedPhone =
          breweryPhone.substr(0, 3) +
          "-" +
          breweryPhone.substr(3, 3) +
          "-" +
          breweryPhone.substr(6, 4);
        console.log(city, breweryName, breweryLat, breweryLon, formattedPhone);
        googleQuery(city, breweryName, breweryLat, breweryLon, formattedPhone);
      }
    }

    //End
  });
}

function googleQuery(
  city,
  breweryName,
  breweryLat,
  breweryLon,
  formattedPhone
) {
  //AJAX QUERY FOR GOOGLE
  var queryURLGoogle =
    "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
    breweryName +
    "+" +
    city +
    "+" +
    state +
    "&inputtype=textquery&fields=photos,geometry,formatted_address,name,opening_hours,rating,place_id&key=AIzaSyBdbsiqFxjAUt8-qUuCt4dsHTdnnJSJ3iU";
  $.ajax({
    url: queryURLGoogle,
    method: "GET"
  }).then(function(response) {
    var googleBreweryName = response.candidates[0].name;
    var googleBreweryAddress = response.candidates[0].formatted_address;
    var googleBreweryRating = response.candidates[0].rating;
    var brewery = {
      name: breweryName,
      breweryLat: breweryLat,
      breweryLon: breweryLon,
      breweryGoogle: googleBreweryName,
      address: googleBreweryAddress,
      rating: googleBreweryRating,
      formattedPhone: formattedPhone
    };
    breweries.push(brewery);
    console.log(breweries);
  });
  callPage();
}

function callPage() {
  for (i = 0; i < breweries.length; i++) {
    var breweryp = $("<li>").html(
      '<i class="material-icons circle">local_drink</i>' +
        '<span class="title">' +
        name[i] +
        "</span>" +
        "<p>" +
        "<br />" +
        formattedPhone[i] +
        '</p><a href="#!" class="secondary-content" style="text-align: center;"><i class="material-icons">grade</i><br>' +
        rating[i] +
        "</a>"
    );
    $(breweryp).attr("class", "collection-item avatar");
    $("#search-results").append(breweryp);
  }
}

// searchKickOff();
//On click call new map - Kick Off getting data
$("#find-beer").on("click", function() {
  city = $("#city-input")
    .val()
    .trim();
  console.log(city);

  searchKickOff(city);
});
