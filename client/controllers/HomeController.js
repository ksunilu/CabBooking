angular.module('myApp')
    .controller('HomeController', function ($scope, $http, crudService) {


        // var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();


        function initData() {
            console.log('Trying get all data.');
            $scope.alltariff = {};
            $scope.rec = {};

            var promise = crudService.getAllData('/tariffs');
            promise.then(function (data) {
                $scope.alltariff = data;
            });
        };
        initData();

        ///////////////////////// // map code starts ////////////////////////////

        $scope.initMap = function () {

            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 28.61, lng: 77.23 },
                zoom: 10
            });

            new google.maps.places.SearchBox(document.getElementById('txtFrom'));
            new google.maps.places.SearchBox(document.getElementById('txtTo'));
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
            directionsDisplay.setMap(map);
        }

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
                        var duration = response.rows[0].elements[0].duration.text;
                        var dvDistance = document.getElementById('dvDistance');
                        dvDistance.innerHTML = '';
                        dvDistance.innerHTML += 'Distance: ' + distance + '<br />';
                        dvDistance.innerHTML += 'Duration:' + duration;

                    } else {
                        alert('Unable to find the distance via road.');
                    }
                });
            });
        //////////////////////// // map code ends ////////////////////////////   



    });
