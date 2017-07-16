"use strict";

angular.module('myApp')
    .controller('BookController', function (AuthenticationService, $location, $rootScope, $scope, $http, $window, crudService) {
        var socket = io();
        var markersArray = [];
        var map, userMarker, userWindow;

        function distance(p1, p2) {
            var a = new google.maps.LatLng(p1.lat, p1.lng);
            var b = new google.maps.LatLng(p2.lat, p2.lng);
            return google.maps.geometry.spherical.computeDistanceBetween(a, b);
        }

        function nearestCab(Location, allLoginUsers) {
            var minDist, nearCab;
            for (var i = 0; i < allLoginUsers.length; i++) {
                if (allLoginUsers[i].data.role !== 'driver') continue;
                //skip all non cab drivers i.e. self also

                if (typeof nearCab === 'undefined') {//pick the first driver
                    minDist = distance(Location, allLoginUsers[i].data.Location);
                    nearCab = allLoginUsers[i].data;
                }
                else {
                    var dist = distance(Location, allLoginUsers[i].data.Location);
                    if (dist < minDist) {
                        minDist = dist;
                        nearCab = allLoginUsers[i].data;
                    }
                }
            }
            return nearCab;
        }

        function changeLocation(Location) {
            $scope.show.origins = Location;
            // var user = AuthenticationService.GetUser();
            $scope.rec.bookUser.Location = Location;
            socket.emit('location', $scope.rec.bookUser);
        }

        function initSocket(map, Location) {

            // var user = AuthenticationService.GetUser();
            $scope.rec.bookUser.Location = Location;
            socket.emit('land', $scope.rec.bookUser);
            socket.on('draw map', function (allLoginUsers) {
                $rootScope.allLoginUsers = allLoginUsers;
                // console.log('all users@book');
                // console.log(allLoginUsers);
                eraseMapObjects();
                drawMarkers(map, allLoginUsers);
                $scope.pickedCab = nearestCab(Location, allLoginUsers);
            });
        }

        function drawMarkers(map, allLoginUsers) {
            // var user = AuthenticationService.GetUser();
            for (var i = 0; i < allLoginUsers.length; i++) {

                if (allLoginUsers[i].data.role === 'driver' ||
                    (allLoginUsers[i].data.role === 'client' &&
                        allLoginUsers[i].data.email === $scope.rec.bookUser.email)) {

                    var location = allLoginUsers[i].data.Location;
                    var iconPath;
                    console.log(allLoginUsers[i]);

                    if (allLoginUsers[i].data.role === 'client') {
                        iconPath = '../public/images/wait.png';
                    }
                    else {
                        iconPath = '../public/images/cab.png';
                    }
                    var marker = new google.maps.Marker({
                        map: map,
                        position: location,
                        icon: iconPath,
                        size: new google.maps.Size(6, 6)
                    });
                    // alert(' in drawMarkers ');
                    markersArray.push(marker);
                }
            }
        }

        function eraseMapObjects() {
            // delete $scope.showBookNow;
            delete $scope.pickedCab;
            // $scope.pickedCab = {};
            // $scope.pickedCab = undefined;
            // alert($scope.showBookNow);

            while (markersArray.length) { markersArray.pop().setMap(null); }

        }

        // var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();

        function initData() {
            $scope.rec = {};
            $scope.show = {};
            $scope.rec.selWhen = 'NOW';
            $scope.rec.bookUser = AuthenticationService.GetUser();
            $scope.rec.bookTravelDate = new Date();


            var day1 = new Date();
            var day2 = new Date();
            var day3 = new Date();
            $scope.show.bookTravelTimeTxt = new Date();
            $scope.show.bookTravelTimeTxt.setHours(day1.getHours() + 12);

            day2.setDate(day1.getDate() + 1);
            day3.setDate(day1.getDate() + 2);
            $scope.alltariff = {};
            $scope.show.bookTravelDateTxt = day1.toLocaleDateString();

            $scope.show.bookTravelDateA = day1.toLocaleDateString();
            $scope.show.bookTravelDateB = day2.toLocaleDateString();
            $scope.show.bookTravelDateC = day3.toLocaleDateString();

            // debugger;

            console.log('Trying get all data.');
            var promise = crudService.getAllData('/tariffs');
            promise.then(function (data) {
                $scope.alltariff = data;
            });
        };

        initData();


        $scope.setTravelDate = function () {
            if ($scope.selWhen === 'NOW')
                $scope.rec.bookTravelDate = new Date();
        }
        $scope.validateTime = function () {
            // debugger;
            if ($scope.selWhen === 'NOW') {
                $scope.rec.bookTravelDate = Date();
                return;
            }
            var dtStr = $scope.show.bookTravelDateTxt.toString();
            var parts = dtStr.split("/");
            var dt = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
            var tm = $scope.show.bookTravelTimeTxt;

            dt.setHours(tm.getHours());
            dt.setMinutes(tm.getMinutes());
            dt.setSeconds(tm.getSeconds());

            $scope.rec.bookTravelDate = dt;
            var lowDt, highDt, now = new Date();
            lowDt = new Date();
            highDt = new Date();

            lowDt.setHours(now.getHours() + 12);
            highDt.setHours(now.getHours() + 48);
            // debugger;

            if (!(dt >= lowDt && dt <= highDt)) {
                alert('Advance Booking should be between' + lowDt.toLocaleString() +
                    ' and ' + highDt.toLocaleString());
                document.getElementById('TravelDate').focus();
            }
        }

        $scope.SaveData = function () {
            console.log($scope.rec);
            angular.element('#myModal').on('hidden.bs.modal', function (e) {
                $location.path('/');
                $scope.$apply();
            });
            var promise = crudService.addData($scope.rec, '/bookings');
            promise.then(function (data) {
                console.log('Booking Data Saved');
                console.log(data);
                angular.element('#myModal').modal('hide');
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
            map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 14
            });
            initSocket(map, location);

            var geocoder = new google.maps.Geocoder;
            parseLatLng2Address(geocoder, location);

            var searchBoxFrm = new google.maps.places.SearchBox(document.getElementById('txtFrom'));
            var searchBoxTo = new google.maps.places.SearchBox(document.getElementById('txtTo'));
            searchBoxFrm.setBounds(map.getBounds());
            searchBoxTo.setBounds(map.getBounds());

            map.addListener('bounds_changed', function () {
                searchBoxFrm.setBounds(map.getBounds());
                searchBoxTo.setBounds(map.getBounds());
            });
            createListener(searchBoxFrm);

            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': false });
            directionsDisplay.setMap(map);
        }
        function createListener(searchBox) {
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                if (places.length == 0) return;

                var place = places[0];

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
            });
        }

        function parseLatLng2Address(geocoder, latlng) {
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        document.getElementById('txtFrom').value = results[1].formatted_address;
                        $scope.rec.bookSource = document.getElementById('txtFrom').value;
                        $scope.show.origins = results[1].geometry.location;
                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
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
        $scope.showModal = function () {
            if ($scope.pickedCab) {
                angular.element('#myModal').modal('show');
            }
            else {
                alert('Unable to locate any cab.');
            }
        }
        $scope.getEstimate = function () {
            //*********DIRECTIONS AND ROUTE**********************//
            $scope.rec.bookSource = document.getElementById('txtFrom').value;
            $scope.rec.bookDestination = document.getElementById('txtTo').value;



            var geocoder = new google.maps.Geocoder;

            if ($scope.show.origins) {
                getLatLngPromise(geocoder, $scope.rec.bookDestination).then(
                    function (destinations) {
                        //we have $scope.show.origins so found destinations 
                        //and routing .....
                        $scope.show.destinations = destinations;
                        calcDistTime();
                        drawRoute();
                    }, function (error) {
                        alert("Failed!- geting destination type again", error);
                    }
                );
            }

            else {
                getLatLngPromise(geocoder, $scope.rec.bookSource).then(
                    function (origins) {
                        getLatLngPromise(geocoder, $scope.rec.bookDestination).then(
                            function (destinations) {
                                $scope.show.origins = origins;
                                $scope.show.destinations = destinations;

                                changeLocation(origins);
                                // EMIT CHANGE OF LOCATION
                                calcDistTime();
                                drawRoute();

                            }, function (error) {
                                alert("Failed!- geting destination type again", error);
                            }
                        );

                    }, function (error) {
                        alert("Failed!- geting origin type again", error);
                    }
                );
            }
            //show book cab
            // document.getElementById('showBookNow').style.display = 'block';
            // debugger;


            // if (typeof $scope.pickedCab !== 'undefined') {
            //     $scope.showBookNow = true;
            // }
            // else {
            //     $scope.showBookNow = false;
            // }
        }; //end click event

        function calcDistTime() {
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [$scope.show.origins],
                destinations: [$scope.show.destinations],
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
                    $scope.rec.duration = response.rows[0].elements[0].duration.text;

                    angular.element('#showBookDiv').show();
                    var dvDistance = document.getElementById('ansPara');
                    var totalFare, tariff;
                    if ($scope.rec.bookTravelDate === undefined)
                        $scope.rec.bookTravelDate = new Date();

                    var hrmin = $scope.rec.bookTravelDate.getHours() * 100 + $scope.rec.bookTravelDate.getMinutes();
                    if (hrmin >= $scope.rec.bookVehicleType.peakStartHR && hrmin <= $scope.rec.bookVehicleType.peakEndHR)
                        tariff = $scope.rec.bookVehicleType.baseTariff;
                    else
                        tariff = $scope.rec.bookVehicleType.peakTariff;
                    totalFare = parseFloat(tariff) * parseFloat(dist)
                    totalFare = totalFare.toFixed(2);
                    $scope.rec.totalFare = totalFare;
                    $scope.rec.tariff = tariff;

                    dvDistance.innerHTML = '<small> Distance: ' + distance + ' <br /> Duration : ' +
                        $scope.rec.duration + ' <br /> Fare@' + tariff + ' : Rs.' + totalFare + '</small>';
                } else {
                    alert('Unable to find the distance via road.');
                }

            });
        }
        function drawRoute() {
            directionsService.route({
                origin: $scope.show.origins,
                destination: $scope.show.destinations,
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
