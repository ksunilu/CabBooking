"use strict";

angular.module('myApp')
    .controller('BookController', function ($scope, $http, $window, crudService) {

        // var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();

        function initData() {
            console.log('Trying get all data.');
            $scope.alltariff = {};
            $scope.rec = {};
            $scope.rec.bookTravelDate = new Date();
            var promise = crudService.getAllData('/tariffs');
            promise.then(function (data) {
                $scope.alltariff = data;
            });
        };
        initData();


        $scope.setTravelDate = function () {
            if ($scope.selWhen === 'NOW')
                $scope.rec.bookTravelDate = Date();
        }


        $scope.SaveData = function () {
            console.log($scope.rec);

            var promise = crudService.addData($scope.rec, '/bookings');
            promise.then(function (data) {
                console.log(data);
                initData();
            });
        }

        ///////////////////////// // map code starts ////////////////////////////
        $scope.initMap = function () {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                var loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                $scope.drawInitMap(loc);
                $scope.location = loc;
                //broad cast location
            });
        }

        $scope.drawInitMap = function (location) {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 14
            });
            var marker = new google.maps.Marker({
                map: map,
                position: location,
                icon: '../public/images/wait.png',
                size: new google.maps.Size(6, 6)
            });
            var infoWindow = new google.maps.InfoWindow({
                content: 'Your Location.'
            });
            var geocoder = new google.maps.Geocoder;

            infoWindow.open(map, marker);
            geocodeLatLng(geocoder, location);

            new google.maps.places.SearchBox(document.getElementById('txtFrom'));
            new google.maps.places.SearchBox(document.getElementById('txtTo'));
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
            directionsDisplay.setMap(map);
        }

        function geocodeLatLng(geocoder, latlng) {
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        document.getElementById('txtFrom').value = results[1].formatted_address;
                        $scope.rec.origins = results[1].geometry.location;
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }
        function codeAddress(geocoder, address) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == 'OK') {
                    map.setCenter(results[0].geometry.location);

                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        function getAddressPromise(geocoder, latlng) {
            return new Promise(function (resolve, reject) {
                geocoder.geocode({ 'location': latlng }, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            resolve(results[1].formatted_address);
                        } else {
                            reject(Error('No results found'));
                        }
                    } else {
                        reject(Error('Geocoder failed :' + status));
                    }
                });
            });
        }

        function getLatLngPromise(geocoder, address) {
            return new Promise(function (resolve, reject) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == 'OK') {
                        resolve(results[0].geometry.location);
                    } else {
                        reject(Error('Geocode not successful: ' + status));
                    }
                });
            });
        }



        //////////////////// end init map ////////////////////////
        //start click event
        google.maps.event.addDomListener(document.getElementById('routeClick'), 'click',
            function () {
                //*********DIRECTIONS AND ROUTE**********************//
                var address1 = document.getElementById('txtFrom').value;
                var address2 = document.getElementById('txtTo').value;
                var geocoder = new google.maps.Geocoder;
                debugger;
                if ($scope.rec.origins) {
                    getLatLngPromise(geocoder, address2).then(
                        function (destinations) {
                            //we have $scope.rec.origins so found destinations 
                            //and routing .....
                            $scope.rec.destinations = destinations;
                            calcDistTime();
                            drawRoute();
                        }, function (error) {
                            alert("Failed!-inner", error);
                        }
                    );
                }

                else {
                    getLatLngPromise(geocoder, address1).then(
                        function (origins) {
                            getLatLngPromise(geocoder, address2).then(
                                function (destinations) {
                                    $scope.rec.origins = origins;
                                    $scope.rec.destinations = destinations;

                                    calcDistTime();
                                    drawRoute();

                                }, function (error) {
                                    alert("Failed!-inner", error);
                                }
                            );

                        }, function (error) {
                            alert("Failed!-outer", error);
                        }
                    );
                }
            }); //end click event

        function calcDistTime() {
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [$scope.rec.origins],
                destinations: [$scope.rec.destinations],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK &&
                    response.rows[0].elements[0].status != 'ZERO_RESULTS') {

                    var distance = response.rows[0].elements[0].distance.text;
                    var dist = distance.replace('km', '');

                    $scope.rec.bookDistance = parseFloat(dist);
                    var duration = response.rows[0].elements[0].duration.text;
                    var dvDistance = document.getElementById('dvDistance');
                    dvDistance.innerHTML = 'Distance: ' + distance + '<br />' +
                        'Tentative Duration:' + duration;

                } else {
                    alert('Unable to find the distance via road.');
                }
                $scope.SaveData();
            });
        }
        function drawRoute() {
            directionsService.route({
                origin: $scope.rec.origins,
                destination: $scope.rec.destinations,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
                else
                    throw 'unable to route';
            });
        }
        //////////////////////// // map code ends ////////////////////////////   
    });
