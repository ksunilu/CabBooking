angular.module('myApp')
    .controller('HomeController', function ($scope, $http, crudService) {

        $scope.book = {};
        var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();


        function initData() {
            console.log('Trying get all data.');
            $scope.alltariff = {};
            $scope.Data = {};

            var promise = crudService.getAllData('/tariffs');
            promise.then(function (data) {
                $scope.alltariff = data;
            });
        };
        initData();

        ///////////////////////// // map code starts ////////////////////////////

        $scope.initMap = function () {
            new google.maps.places.SearchBox(document.getElementById('txtFrom'));
            new google.maps.places.SearchBox(document.getElementById('txtTo'));
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
        }

        google.maps.event.addDomListener(document.getElementById('routeClick'), 'click',
            function () {


                //*********DIRECTIONS AND ROUTE**********************//
                source = document.getElementById('txtFrom').value;
                destination = document.getElementById('txtTo').value;

                var request = {
                    origin: source,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                });

                //*********DISTANCE AND DURATION**********************//
                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [source],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false
                }, function (response, status) {
                    if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != 'ZERO_RESULTS') {
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
