var start = {lat:40.7410986, lng:-73.9888682};
var end;
var map;

function initAutocomplete() {

  //var
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:40.7410986, lng:-73.9888682},
    zoom: 13
  });

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  // start = pos;
  var pos = start;

  // infoWindow.setPosition(pos);
  // infoWindow.setContent('Location found.');
  map.setCenter(pos);
  //   }, function() {
  //     handleLocationError(true, map.getCenter());
  //   });
  // }

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  // Randomly miss-direct
  var missDirect = function(deg) {
    var missDegrees = (Math.random()/1000) * 5;
    var prob = (Math.random()/1000) * 5;
    if (prob > 0.5) return deg - missDegrees;
    else return deg + missDegrees;
  }



  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var theRealPlaces = searchBox.getPlaces();
    //we're getting trickay -- copied and altered real places
    var places = [Object.create(theRealPlaces[0])];
    var originalLat = places[0].geometry.location.lat();
    var originalLng = places[0].geometry.location.lng();
    var newLat = missDirect(originalLat);
    var newLng = missDirect(originalLng);
    places[0].geometry.location.lat = function() {return newLat};
    places[0].geometry.location.lng = function() {return newLng};
    end = {lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng()};

    console.log('CENTER! ', places[0].geometry.viewport.getCenter());
    //no more tricks
    console.log("places", places);
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    document.getElementById('submit').addEventListener('click', function() {
      placeDetailsByPlaceId(service, map, infowindow);
    });

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: "./ic_location_on_black_24px.svg",
        size: new google.maps.Size(80, 80),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        draggable: true,
        scaledSize: new google.maps.Size(25, 25)
      };

      console.log('VIEWPORT ', place.geometry.viewport);

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    map.setCenter(end);

  });


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  console.log("There is an error with geolocation")
}

function getDirections() {

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  console.log("start", start, "end", end)
  directionsService.route({
    origin: new google.maps.LatLng(start),
    destination: new google.maps.LatLng(end),
    travelMode: 'TRANSIT'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

}


function placeDetailsByPlaceId(service, map, infowindow) {
  // Create and send the request to obtain details for a specific place,
  // using its Place ID.
  var request = {
    placeId: document.getElementById('place-id').value
  };

  service.getDetails(request, function (place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // If the request succeeds, draw the place location on the map
      // as a marker, and register an event to handle a click on the marker.
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address + '</div>');
        infowindow.open(map, this);
      });

      map.panTo(place.geometry.location);
    }
  });
}

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
