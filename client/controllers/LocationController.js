angular.module('myApp')
    .controller('LocationController', function ($scope, $http, AuthenticationService) {

        // var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var mapData = {};
        $scope.initMap = function () {
            initData();
            //initEvents();
        }

        function initData() {
            debugger;
            mapData.location = AuthenticationService.getLocation();
            mapData.map = new google.maps.Map(document.getElementById('map'), {
                center: mapData.location,
                zoom: 10
            });

            mapData.marker = new google.maps.Marker({
                map: mapData.map,
                position: mapData.location
            });

            mapData.infoWindow = new google.maps.InfoWindow({
                content: 'Your Location.' + JSON.stringify(mapData.location)
            });
            mapData.infoWindow.open(map, mapData.marker);

            // marker.setPosition(location);
            // marker.setVisible(true);

            // infoWindow.setPosition(location);
            // infoWindow.setContent('Your Location.');
            map.setCenter(location);

        }

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

        function initEvents() {
            // code  for text box start 
            var inputFrom = document.getElementById('txtFrom');
            mapData.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputFrom);

            var autocomplete = new google.maps.places.Autocomplete(inputFrom);
            //autocomplete.bindTo('bounds', mapData.map);
            // add addListener for text box start 
            autocomplete.addListener('place_changed', function () {
                mapData.marker.setVisible(false);
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }
                if (place.geometry.viewport) {
                    mapData.map.fitBounds(place.geometry.viewport);
                } else {
                    mapData.map.setCenter(place.geometry.location);
                    mapData.map.setZoom(10);
                }

                mapData.marker.setIcon(({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));

                mapData.marker.setPosition(place.geometry.location);
                mapData.marker.setVisible(true);
                $scope.location = place.geometry.location;
            });
            // add addListener for text box ends 
        }
        //init map function stop ===========================


    });
