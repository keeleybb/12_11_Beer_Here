var city = "denver";
var state = "colorado";
var breweries = [];

//On click call new map - Kick Off getting data

function searchKickOff() {
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

        googleQuery(breweryName, breweryLat, breweryLon, formattedPhone);
      }
    }

    //End
  });
}

function googleQuery(breweryName, breweryLat, breweryLon, formattedPhone) {
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
    console.log(
      "Matching? " +
        googleBreweryName +
        " " +
        googleBreweryAddress +
        " " +
        googleBreweryRating +
        " " +
        JSON.stringify(response.candidates[0])
    );
    callPage(
      breweryName,
      googleBreweryName,
      googleBreweryAddress,
      googleBreweryRating,
      breweryLat,
      breweryLon,
      formattedPhone
    );
  });
}

function callPage(
  breweryName,
  googleBreweryName,
  googleBreweryAddress,
  googleBreweryRating,
  breweryLat,
  breweryLon,
  formattedPhone
) {
  //Add to page
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

  //From Here, I would like to create a new function to fill in the map once its done.
  var breweryp = $("<p>").html(
    breweryName +
      "<br/>" +
      googleBreweryName +
      "<br/>" +
      googleBreweryAddress +
      "<br>" +
      googleBreweryRating +
      "<br>" +
      formattedPhone
  );
  $("#search-results").append(breweryp);
  //   console.log("What is here?", breweries, " ", breweries.length);
  //   console.log(breweryLat);
  // var coords = results.features[i].geometry.coordinates;
  // var latLng = new google.maps.LatLng(breweryLat, breweryLat);
  // var marker = new google.maps.Marker({
  //   position: latLng,
  //   map: map
  // });

  // Create a marker for each brewery, does not need unique name
  var newBrewery = new google.maps.Marker({
    position: {
      lat: parseFloat(breweryLat),
      lng: parseFloat(breweryLon)
    },
    map: map,
    title: googleBreweryName
    // label: brewNum.toString()
  });
}

searchKickOff();
