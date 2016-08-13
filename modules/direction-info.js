// START LAT/LONG
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		}
	})
}

