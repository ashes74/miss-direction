function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var theRealPlaces = searchBox.getPlaces();
          //we're getting trickay -- copied and altered real places
          var places = [Object.create(theRealPlaces[0])];
          places[0].geometry.location.lat = function() {return 40.8091005};
          places[0].geometry.location.lng = function() {return -73.9639386};

          places[0].geometry.viewport.getCenter = function(){
            return {
              lat: function() {return 40.8091005}, 
              lng: function() {return -73.9639386}
            }
          }

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

            // Randomly miss-direct
            // var missDirect = function(lat, lng) {
            //   var missDegrees = (Math.random()/1000) * 5;
            //   var sign = function() {
            //     var prob = (Math.random()/1000) * 5;
            //     if (prob > 0.5) return 
            //   }
            // }
            
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
              //giza?
              // position: {
              //   lat: function(){
              //     return 28.766621;
              //   },
              //   lng: function(){
              //     return 29.232078399999978;
              //   }
              // }
            }));

            // console.log('SEARCHED LOCATION ', place.geometry.location.toJSON());

            //place.geometry.location.lat(30)

            // console.log('SEARCHED LOCATION ', place.geometry.location.lat(30) );
           // console.log(place.geometry.location.lat(function() {return 30}))

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }



