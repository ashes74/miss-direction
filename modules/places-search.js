 var start;
var end;

function initAutocomplete() {
       

        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            start = pos;

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, map.getCenter());
          });
        }

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

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
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

                  var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);
        console.log("start", start, "end", end)
        directionsService.route({
          origin: new google.maps.LatLng(start),
          destination: new google.maps.LatLng(end),
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        });


      }



