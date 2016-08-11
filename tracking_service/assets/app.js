
var lat = -34.397;
var lng = 150.644;
var position = {lat, lng};
console.log(position);
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: position,
          zoom: 2
        });

        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var infoWindow = new google.maps.InfoWindow({map: map});
        var map_marker = new google.maps.Marker({
            position: position,
            //icon: image,
            map: map
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            //marker.setPosition(new google.maps.LatLng(pos.lat, pos.lng));
            map_marker.setPosition(pos);
            map_marker.setMap(map);
            map.setZoom(17);
            map.setCenter(pos);

            var i=0;
            setInterval(function() {
                pos.lat -=0.00007;
                pos.lng-=0.000007;
                redraw(pos);

            },400);

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
            map.setCenter({lat: pos.lat, lng : pos.lng, alt: 0})
            map_marker.setPosition({lat: pos.lat, lng : pos.lng, alt: 0});
        }

      }
