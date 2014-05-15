/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Date
 * @module Date
 */
var datePick = angular.module('date', ['ui.bootstrap.datepicker']);

/* Cache the template file */
datePick.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('date.html', require('./template.html'));
        $templateCache.put('day.html', require('./day.html'));
        $templateCache.put('month.html', require('./month.html'));
        $templateCache.put('year.html', require('./year.html'));
        $templateCache.put('mydatepicker.html', require('./datepicker.html'));
    }
]);

/**
 * Date directive.
 * @module Date
 * @name Date
 * @type {Directive}
 */
datePick.directive('date', [
    function directive() {

        var datepick = {

            restrict: TO += ELEMENTS,

            templateUrl: 'date.html'
        };

        return datepick;
    }
]);

/**
 * Date controller
*/
datePick.controller('dateController', [
    '$scope',
    function($scope) {
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
    }
]);

/**
* Date config
*/
datePick.config( [
    '$provide', 'datepickerConfig', 'datepickerPopupConfig',
    function($provide, datepickerConfig, datepickerPopupConfig) {
        datepickerConfig.showWeeks = false;
        datepickerConfig.maxDate = Date.now();
        datepickerPopupConfig.showButtonBar = false;

        $provide.decorator('datepickerDirective', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'mydatepicker.html';
            return $delegate;
        });
        $provide.decorator('daypickerDirective', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'day.html';
            return $delegate;
        });
        $provide.decorator('monthpickerDirective', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'month.html';
            return $delegate;
        });
        $provide.decorator('yearpickerDirective', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'year.html';
            return $delegate;
        });
    }
]);