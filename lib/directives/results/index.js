/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Results
 * @module Results
 */
var Results = angular.module('results', []);

/**
 * Results directive.
 * @module Results
 * @name Results
 * @type {directive}
 */
Results.directive('results', [
    '$q',
    function directive($q) {

        var Results = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {

                query: '=',
                nodata: '=?'
            },

            templateUrl: 'lib/directives/results/template.html',

            link: function($scope, element, attributes) {

                $scope.$watch('query', function(query) {

                    if (query) {

                        $scope.error = false;
                        $scope.queried = false;
                        $scope.querying = true;

                        query

                        .then(function(results) {

                            $scope.error = false;
                            $scope.queried = true;
                            $scope.querying = false;
                            $scope.results = results;

                        }, function() {

                            $scope.error = true;
                            $scope.queried = true;
                            $scope.querying = false;

                        }, function() {

                            $scope.error = false;
                            $scope.queried = false;
                            $scope.querying = true;
                        });
                    }
                });
            }
        };

        return Results;
    }
]);

export default Results;
