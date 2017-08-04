angular.module('myApp')
    .controller('LocationController',
    function ($window, $scope, $http, AuthenticationService, $rootScope) {

        var socket = io();
        var map, infoWindow, marker;

        function initSocket(Location) {
            // debugger;
            var user = AuthenticationService.GetUser();
            user.Location = Location;
            socket.emit('land', user);
            socket.on('draw map', function (loggedUsers) {
                // debugger;
                $rootScope.loggedUsers = loggedUsers;
                console.log('all users@location');
                console.log(loggedUsers);
                // alert('draw map for driver');
                // $rootScope.currentUser = response.data.user;
            });
            socket.on('cab booked', function (data) {
                $scope.cab = data;
                $scope.driver = AuthenticationService.GetUser();

                if ($scope.cab.bookedCab.email === $scope.driver.email) alert('you have a booking');
                alert(JSON.stringify(data));
                console.log(data);

            });
        }


        $scope.init = function () {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                drawInitMap(loc);
                initSocket(loc);
                $scope.Location = loc;
                //broad cast location
                $scope.cab = {};
                $scope.driver = {};
            });
            return;
            //code end
            //definition of local functions 
            function drawInitMap(location) {


                map = new google.maps.Map(document.getElementById('map'), {
                    center: location,
                    zoom: 14
                });

                paintMap(map, location);
                initTextbox(map, location, marker, infoWindow);
            }

            function paintMap(map, location) {
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

                    changeLocation(place.geometry.location);

                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);
                    infoWindow.setContent('Your typed Location.');
                    infoWindow.open(map, marker);
                    $scope.Location = place.geometry.location;
                });
            }

            function changeLocation(Location) {
                // debugger;
                alert('location change');
                var user = AuthenticationService.GetUser();
                user.Location = Location;
                socket.emit('location', user);
            }

        }
    });
