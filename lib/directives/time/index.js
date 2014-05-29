/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Add Time
 * @module Time
 */
var TimePicker = angular.module('time', []);

/* Cache the template file */
TimePicker.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('time.html', require('./template.html'));
    }
]);

/**
 *Time directive.
 * @module Time
 * @name Time
 * @type {Directive}
 */
TimePicker.directive('time', [
    function directive() {

        var timepicker = {

            restrict: TO += ELEMENTS,

            scope: {
                date: '=ngModel',
                min: '=',
                max: '='
            },

            templateUrl: 'time.html',
            controller: 'TimePicker.controller'
        };

        return timepicker;
    }
]);

/**
 * Time controller
*/
TimePicker.controller('TimePicker.controller', [
    '$scope',
    function($scope) {

        $scope.hours = $scope.min;

        $scope.hoursUp = function() {
            $scope.hours++;
        };

        $scope.hoursDown = function() {
            $scope.hours--;
        };

        $scope.$watch('hours', function(hours) {
            if (hours) {
                if (hours > $scope.max) {
                    $scope.hours = $scope.max;
                }

                if (hours < $scope.min) {
                    $scope.hours = $scope.min;
                }

                var now = moment();
                var date = now.add(hours, 'hours');
                $scope.date = date;
            }
        });
    }
]);

/**
* Time config
*/
TimePicker.config([
    '$provide',
    function($provide) {
    }
]);

