angular.module('myApp')
    .controller('LocationController',
    function ($window, $scope, $http, AuthenticationService) {
        $scope.init = function () {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                drawInitMap(loc);
                $scope.location = loc;
                //broad cast location
            });
            return;
            //code end
            //definition of local functions 
            function drawInitMap(location) {
                var map, infoWindow, marker;

                map = new google.maps.Map(document.getElementById('map'), {
                    center: location,
                    zoom: 14
                });
                marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    icon: '../public/images/cab.png',
                    size: new google.maps.Size(36, 36)
                });
                infoWindow = new google.maps.InfoWindow({
                    content: 'Your Location.'
                });
                infoWindow.open(map, marker);
                map.setCenter(location);
                initTextbox(map, location, marker, infoWindow);
            }
            function initTextbox(map, location, marker, infoWindow) {
                // var directionsDisplay;
                // var directionsService = new google.maps.DirectionsService();
                var inputFrom = document.getElementById('txtFrom');
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputFrom);
                var autocomplete = new google.maps.places.Autocomplete(inputFrom);
                autocomplete.bindTo('bounds', map);

                autocomplete.addListener('place_changed', function () {

                    marker.setVisible(false);
                    infoWindow.close();

                    var place = autocomplete.getPlace();
                    if (!place.geometry) {
                        window.alert("Autocomplete's returned place contains no geometry");
                        return;
                    }
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(10);
                    }

                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);
                    infoWindow.setContent('Your typed Location.');
                    infoWindow.open(map, marker);
                    $scope.location = place.geometry.location;
                });
            }

        }
    });
