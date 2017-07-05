angular.module('myApp')
    .controller('LocationController', function ($scope, $http, AuthenticationService) {

        // var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();

        function initData() {
            var location = AuthenticationService.getLocation();
            var map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 15
            });

            var infoWindow = new google.maps.InfoWindow();

            var marker = new google.maps.Marker({
                map: map,
                position: location
            });
            marker.setPosition(location);
            marker.setVisible(true);

            infoWindow.setPosition(location);
            infoWindow.setContent('Your Location.');
            infoWindow.open(map);
            map.setCenter(location);

        }


        initData();

        $scope.updateLocation = function () {
            debugger;
            var promise = AuthenticationService.UpdateLocation($scope.location);
            promise.then(function (data) {
                console.log('location updated');
                console.log(data);
                debugger;
            });
        }


        //init map function starts ===========================

        $scope.initMap = function () {
            var location = AuthenticationService.getLocation();
            var map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 15
            });

            var infoWindow = new google.maps.InfoWindow();

            var marker = new google.maps.Marker({
                map: map,
                position: location
            });
            marker.setPosition(location);
            marker.setVisible(true);

            infoWindow.setPosition(location);
            infoWindow.setContent('Your Location.');
            infoWindow.open(map);
            map.setCenter(location);

            // code  for text box start 
            var inputFrom = document.getElementById('txtFrom');
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputFrom);

            var autocomplete = new google.maps.places.Autocomplete(inputFrom);
            autocomplete.bindTo('bounds', map);
            // add addListener for text box start 
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
            // add addListener for text box ends 
        }
        //init map function stop ===========================


    });
