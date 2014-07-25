/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Add AddTime
 * @module AddTime
 */
var AddTime = angular.module('AddTime', []);

/* Cache the template file */
AddTime.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-time.html', require('./template.html'));
    }
]);

/**
 *AddTime directive.
 * @module AddTime
 * @name AddTime
 * @type {Directive}
 */
AddTime.directive('addTime', [
    function directive() {

        var addtime = {

            restrict: TO += ELEMENTS,

            scope: {
                date: '=ngModel',
                min: '=',
                max: '='
            },

            templateUrl: 'add-time.html',
            controller: 'AddTime.controller'
        };

        return addtime;
    }
]);

/**
 * AddTime controller
*/
AddTime.controller('AddTime.controller', [
    '$scope',
    function($scope) {

        $scope.hours = $scope.min;

        $scope.hoursUp = function() {
            if ($scope.hours < $scope.max) {
                $scope.hours++;
            }
        };

        $scope.hoursDown = function() {
            if ($scope.hours > $scope.min) {
                $scope.hours--;
            }
        };

        $scope.$watch('hours', function(hours) {
            if (hours) {
                if (hours > $scope.max) {
                    $scope.hours = $scope.max;
                }

                if (hours < $scope.min) {
                    $scope.hours = $scope.min;
                }

                var initialDate = moment($scope.date);

                console.log(initialDate);

                var targetDate = initialDate.add({h: hours});

                console.log(targetDate);

                $scope.date = targetDate;
            }
        });
    }
]);
