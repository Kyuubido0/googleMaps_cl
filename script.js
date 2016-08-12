//Vars for the lat and lng
var lat = 45.756432;
var lng = 21.228477;
var pos = {lat, lng};
//Vars for the origin and destination point for dist and dur
var origin_calc;
var dest_calc;

function initMap() {
	var origin_place_id = null;
	var destination_place_id = null;
	var travel_mode = 'DRIVING';
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControl: false,
		center: {lat: 45.7494444, lng: 21.2272222},
		zoom: 13,
		styles: [{"featureType":"all",
			"elementType":"labels.text.fill",
			"stylers": [{"saturation":36},{"color":"#000000"},{"lightness":40}]},
			{"featureType":"all",
			"elementType":"labels.text.stroke",
			"stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},
			{"featureType":"all",
			 "elementType":"labels.icon",
			 "stylers":[{"visibility":"off"}]},
			{"featureType":"administrative",
			 "elementType":"geometry.fill",
			 "stylers":[{"color":"#000000"},{"lightness":20}]},
			{"featureType":"administrative",
			 "elementType":"geometry.stroke",
			 "stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},
			{"featureType":"landscape",
			 "elementType":"geometry",
			 "stylers":[{"color":"#000000"},{"lightness":20}]},
			{"featureType":"poi","elementType":"geometry",
			 "stylers":[{"color":"#000000"},{"lightness":21}]},
			{"featureType":"road.highway",
			 "elementType":"geometry.fill",
			 "stylers":[{"color":"#000000"},{"lightness":17}]},
			{"featureType":"road.highway",
			 "elementType":"geometry.stroke",
			 "stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},
			{"featureType":"road.arterial",
			 "elementType":"geometry",
			 "stylers":[{"color":"#000000"},{"lightness":18}]},
			{"featureType":"road.local",
			 "elementType":"geometry",
			 "stylers":[{"color":"#000000"},{"lightness":16}]},
			{"featureType":"transit",
			 "elementType":"geometry",
			 "stylers":[{"color":"#000000"},{"lightness":19}]},
			{"featureType":"water",
			 "elementType":"geometry",
			 "stylers":[{"color":"#000000"},{"lightness":17}]}]
	});

	var directionsService = new google.maps.DirectionsService;
	var rendererOptions = {
		map: map,
    	suppressMarkers: false,
    	polylineOptions: {
      		strokeColor: '#ffffff'
    	}
  	};

  	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	directionsDisplay.setMap(map);
	/*directionsDisplay.setOptions( { suppressMarkers: true } );*/

  	var origin_input = document.getElementById('origin-input');
  	var destination_input = document.getElementById('destination-input');
  	var modes = document.getElementById('mode-selector');

  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);

  	var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  	origin_autocomplete.bindTo('bounds', map);
  	var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
  	destination_autocomplete.bindTo('bounds', map);

	//Place marker on origin_destination and place the animated marker
	var marker = new google.maps.Marker({ map: map, icon: 'assets/placeholder-14.png' });

	var map_marker = new google.maps.Marker({
		map: map,
		position: pos,
		animation: google.maps.Animation.DROP,
		title: "basic-animated-picker",
		icon: "assets/car3-32x32.png",
		zIndex: 99
	});

		map_marker.setPosition(pos);
		map_marker.setMap(map);
		map_marker.setVisible(false);

    	origin_autocomplete.addListener('place_changed', function() {
		var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
			return;
		}
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
            map.setZoom(25);
		}
        // Set the position of the marker using the place ID and location.
		marker.setPlace({
			placeId: place.place_id,
            location: place.geometry.location,
		});
		marker.setVisible(true);

	});

  	function expandViewportToFitPlace(map, place) {
    	if (place.geometry.viewport) {
      		map.fitBounds(place.geometry.viewport);
    	} else {
      		map.setCenter(place.geometry.location);
			map.setZoom(10);
    	}
  	}

  	origin_autocomplete.addListener('place_changed', function() {
    	var place = origin_autocomplete.getPlace();
		origin_calc = place.formatted_address;
		console.dir(place);
    	if (!place.geometry) {
      		window.alert("Autocomplete's returned place contains no geometry.");
      		return;
    	}
    	expandViewportToFitPlace(map, place);
    	// If the place has a geometry, store its place ID and route if we have the other place ID
    	origin_place_id = place.place_id;
    	route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
  	});

  	destination_autocomplete.addListener('place_changed', function() {
    	var place = destination_autocomplete.getPlace();
		dest_calc = place.formatted_address;
    	if (!place.geometry) {
      		window.alert("Autocomplete's returned place contains no geometry.");
      		return;
    	}
    	expandViewportToFitPlace(map, place);
    	// If the place has a geometry, store its place ID and route if we have the other place ID
		destination_place_id = place.place_id;
    	route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
		marker.setVisible(false);
		map_marker.setVisible(true);

		//Set interval for speed and take the mag of the lng and lat
		window.setInterval(function() {
			pos.lat -= 0.00005;
			pos.lng -= 0.00005;
			map_marker.setPosition(pos);
		}, 1000/10);
  	});

  	function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
    	if (!origin_place_id || !destination_place_id) {
      		return;
    	}
    	directionsService.route({
      		origin: {'placeId': origin_place_id},
      		destination: {'placeId': destination_place_id},
      		travelMode: travel_mode
    	},
		function(response, status) {
      		if (status === 'OK') {
        		directionsDisplay.setDirections(response);

				var origin1 = origin_calc;
				var destinationA = dest_calc;

				console.dir(origin1);
				var service = new google.maps.DistanceMatrixService();
				service.getDistanceMatrix({
					origins: [origin1],
					destinations: [destinationA],
					travelMode: 'DRIVING',
					unitSystem: google.maps.UnitSystem.METRIC
				}, callback);
				function callback(response, status) {
					console.dir( response);
					if(status == 'OK') {
						var origins = response.originAddresses[0];
						var destinations = response.destinationAddresses[0];
						var results = response.rows[0].elements[0];
						var distance = results.distance.text;
						var duration = results.duration.text;
					}
				}
      		} else {
        		window.alert('Directions request failed due to ' + status);}
    	});
  	}
}