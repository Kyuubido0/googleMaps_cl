/*
function initMap() {
    // Initialize the Google Maps API v3
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marker = null;

    function autoUpdate() {
      navigator.geolocation.getCurrentPosition(function(position) {
        var newPoint = new google.maps.LatLng(position.coords.latitude,
                                              position.coords.longitude);

        if (marker) {
          // Marker already created - Move it
          marker.setPosition(newPoint);
        }
        else {
          // Marker does not exist - Create it
          marker = new google.maps.Marker({
            position: newPoint,
            map: map
          });
        }

        // Center the map on the new position
        map.setCenter(newPoint);
      });

      // Call the autoUpdate() function every 5 seconds
      setTimeout(autoUpdate, 5000);
    }

    autoUpdate();
}
*/

var lat = 42.756432;
var lng = 21.228477;
var position = {lat, lng};


console.log(position);
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: position,
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infoWindow = new google.maps.InfoWindow({map: map});



        var map_marker = new google.maps.Marker({
            map: map,
            position: position,
            animation: google.maps.Animation.DROP,
            //icon: image,

            zIndex: 99
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {


            var marker = null;

            function autoUpdate() {
              navigator.geolocation.getCurrentPosition(function(position) {

                alert(position.coords.latitude);

                var newPoint = new google.maps.LatLng(position.coords.latitude,
                                                      position.coords.longitude);

                if (marker) {
                  // Marker already created - Move it
                  marker.setPosition(newPoint);
                }
                else {
                  // Marker does not exist - Create it
                  marker = new google.maps.Marker({
                    position: newPoint,
                    map: map
                  });
                }

                // Center the map on the new position
                map.setCenter(newPoint);
              });

              // Call the autoUpdate() function every 5 seconds
              setTimeout(autoUpdate, 5000);
            }

            autoUpdate();


          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                                'Error: The Geolocation service failed.' :
                                'Error: Your browser doesn\'t support geolocation.');
        }

        function redraw(pos) {
            //map.setCenter({lat: pos.lat, lng : pos.lng, alt: 0})
            map.panTo(pos);
            map_marker.setPosition({lat: pos.lat, lng : pos.lng, alt: 0});

        }

      }
