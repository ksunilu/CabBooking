angular.module('myApp')
    .controller('LocationController',
    function ($window, $scope, $http, AuthenticationService) {
        $scope.init = function () {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                drawInitMap(loc);
                $scope.location = loc;
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
                    position: location
                });
                infoWindow = new google.maps.InfoWindow({
                    content: 'Your Location.' + JSON.stringify(location)
                });
                infoWindow.open(map, marker);
                map.setCenter(location);
                initTextbox(map, location);
            }
            function initTextbox(map, location) {
                var directionsDisplay;
                var directionsService = new google.maps.DirectionsService();
                var inputFrom = document.getElementById('txtFrom');
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputFrom);

                var autocomplete = new google.maps.places.Autocomplete(inputFrom);
                autocomplete.bindTo('bounds', map);

                var infowindow = new google.maps.InfoWindow();

                var marker = new google.maps.Marker({
                    map: map,
                    position: location

                });

                autocomplete.addListener('place_changed', function () {
                    marker.setVisible(false);
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

                    marker.setIcon(({
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(35, 35)
                    }));

                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);
                    $scope.location = place.geometry.location;
                });
            }

        }
    });
