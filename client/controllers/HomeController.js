angular.module('myApp')
    .controller('HomeController', function ($scope, $http) {

        ///////////////////////
        $scope.book = {};

        $scope.initMap = function () {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 28.61, lng: 77.23 },
                zoom: 10
            });

            var inputFrom = document.getElementById('txtFrom');
            var inputTo = document.getElementById('txtTo');

            var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
            var autocompleteTo = new google.maps.places.Autocomplete(inputTo);
            autocompleteFrom.bindTo('bounds', map);
            autocompleteTo.bindTo('bounds', map);

            var markerFrom = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29)
            });
            var markerTo = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -49),
                animation: google.maps.Animation.BOUNCE
            });

            autocompleteFrom.addListener('place_changed', function () {
                markerFrom.setVisible(false);
                var place = autocompleteFrom.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }
                if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
                else {
                    map.setCenter(place.geometry.location);
                    // map.setZoom(10);
                }

                markerFrom.setIcon(({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));

                markerFrom.setPosition(place.geometry.location);
                markerFrom.setVisible(true);
            });

            autocompleteTo.addListener('place_changed', function () {
                markerTo.setVisible(false);
                var place = autocompleteTo.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }
                if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
                else {
                    map.setCenter(place.geometry.location);
                    //map.setZoom(10);
                }

                // markerTo.setIcon(({
                //     url: place.icon,
                //     size: new google.maps.Size(71, 71),
                //     origin: new google.maps.Point(0, 0),
                //     anchor: new google.maps.Point(17, 34),
                //     scaledSize: new google.maps.Size(35, 35)
                // }));

                markerTo.setPosition(place.geometry.location);
                markerTo.setVisible(true);
            });

        }


        ////////////////////////    



    });
