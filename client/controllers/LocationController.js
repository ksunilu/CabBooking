angular.module('myApp')
    .controller('LocationController', function ($scope, $http, AuthenticationService) {

        // var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();

        function initData() {

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
            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 28.61, lng: 77.23 },
                zoom: 10
            });


            var inputFrom = document.getElementById('txtFrom');
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputFrom);

            var autocomplete = new google.maps.places.Autocomplete(inputFrom);
            autocomplete.bindTo('bounds', map);

            // var infowindow = new google.maps.InfoWindow();

            // var marker = new google.maps.Marker({
            //     map: map,
            //     anchorPoint: new google.maps.Point(0, -29)
            // });
            var marker = new Marker({
                map: map,
                position: new google.maps.LatLng(-27.46577, 153.02303),
                icon: {
                    path: SQUARE_PIN,
                    fillColor: '#00CCBB',
                    fillOpacity: 1,
                    strokeColor: '',
                    strokeWeight: 0
                },
                map_icon_label: '<span class="map-icon map-icon-point-of-interest"></span>'
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
        //init map function stop ===========================


    });
