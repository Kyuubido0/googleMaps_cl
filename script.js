function initMap() {
	var origin_place_id = null;
	var destination_place_id = null;
	var travel_mode = 'WALKING';
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

  	var origin_input = document.getElementById('origin-input');
  	var destination_input = document.getElementById('destination-input');
  	var modes = document.getElementById('mode-selector');

  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  	var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  	origin_autocomplete.bindTo('bounds', map);
  	var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
  	destination_autocomplete.bindTo('bounds', map);
	
	//Place marker on origin_destination
	var marker = new google.maps.Marker({
		map: map
	});

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
            location: place.geometry.location
		});
		marker.setVisible(true);
	});
	
  	// Sets a listener on a radio button to change the filter type on Places Autocomplete.
	function setupClickListener(id, mode) {
		var radioButton = document.getElementById(id);
    	radioButton.addEventListener('click', function() {
      	travel_mode = mode;
    	});
  	}

  	function expandViewportToFitPlace(map, place) {
    	if (place.geometry.viewport) {
      		map.fitBounds(place.geometry.viewport);
    	} else {
      		map.setCenter(place.geometry.location);
			map.setZoom(17);
    	}
  	}

  	origin_autocomplete.addListener('place_changed', function() {
    	var place = origin_autocomplete.getPlace();
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
    	if (!place.geometry) {
      		window.alert("Autocomplete's returned place contains no geometry.");
      		return;
    	}
    	expandViewportToFitPlace(map, place);
    	// If the place has a geometry, store its place ID and route if we have the other place ID
		destination_place_id = place.place_id;
    	route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
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
      		} else {
        		window.alert('Directions request failed due to ' + status);
      		}
    	});
  	}
}