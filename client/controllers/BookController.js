angular.module('myApp')
    .controller('BookController', function ($scope, $http, crudService) {

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
        $scope.userLocation = function () {
            var location = new google.maps.LatLng(28.61, 77.23);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                });
            }
            return location;
        }

        $scope.initMap = function () {
            var location = $scope.userLocation();
            var map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 10
            });

            new google.maps.places.SearchBox(document.getElementById('txtFrom'));
            new google.maps.places.SearchBox(document.getElementById('txtTo'));
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
            directionsDisplay.setMap(map);
        }
        //////////////////// end init map ////////////////////////
        //start click event
        google.maps.event.addDomListener(document.getElementById('routeClick'), 'click',
            function () {
                //*********DIRECTIONS AND ROUTE**********************//
                $scope.rec.bookSource = document.getElementById('txtFrom').value;
                $scope.rec.bookDestination = document.getElementById('txtTo').value;
                var request = {
                    origin: $scope.rec.bookSource,
                    destination: $scope.rec.bookDestination,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                    else
                        throw 'unable to route';
                });
                //*********DISTANCE AND DURATION**********************//
                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [$scope.rec.bookSource],
                    destinations: [$scope.rec.bookDestination],
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
                        duration = response.rows[0].elements[0].duration.text;

                        var dvDistance = document.getElementById('dvDistance');
                        dvDistance.innerHTML = '';
                        dvDistance.innerHTML += 'Distance: ' + distance + '<br />';
                        dvDistance.innerHTML += 'Duration:' + duration;

                    } else {
                        alert('Unable to find the distance via road.');
                    }
                    $scope.SaveData();
                });
            }); //end click event
        //////////////////////// // map code ends ////////////////////////////   
    });
