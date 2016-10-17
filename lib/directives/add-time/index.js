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

const AddTimeTemplateUrl = 'lib/directives/add-time/template.html';

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
                originalDate: '=?',
                min: '=',
                max: '=',
                modifiedDate: '='
            },

            templateUrl: AddTimeTemplateUrl,
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

        $scope.hours = 6;

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

                var initialDate = (typeof $scope.originalDate === 'undefined') ? moment.utc() : moment.utc($scope.originalDate);
                var targetDate = initialDate.add(hours, 'hours');

                $scope.modifiedDate = targetDate;
            }
        });
    }
]);

export default AddTime;
