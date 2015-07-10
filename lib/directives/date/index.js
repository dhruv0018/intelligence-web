/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Date
 * @module Date
 */
var DatePicker = angular.module('date', ['ui.bootstrap.datepicker']);

/* Cache the template file */
DatePicker.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('date.html', require('./template.html'));
        $templateCache.put('day.html', require('./day.html'));
        $templateCache.put('month.html', require('./month.html'));
        $templateCache.put('year.html', require('./year.html'));
        $templateCache.put('datepicker.html', require('./datepicker.html'));
    }
]);

/**
 * Date directive.
 * @module Date
 * @name Date
 * @type {Directive}
 */
DatePicker.directive('date', [
    function directive() {

        function link($scope, elm, attrs) {
            $scope.isRequired = 'required' in attrs || attrs.ngRequired;
        }

        var datepicker = {

            restrict: TO += ELEMENTS,

            scope: {
                date: '=ngModel',
                maxDate: '=',
                minDate: '=',
                id: '@?'
            },

            templateUrl: 'date.html',
            link: link,
            controller: 'DatePicker.controller'
        };

        return datepicker;
    }
]);

/**
 * Date controller
*/
DatePicker.controller('DatePicker.controller', [
    '$scope',
    function($scope) {
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
    }
]);

DatePicker.directive('datepickerPopup', function() {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    };
});

/**
* Date config
*/
DatePicker.config([
    '$provide', 'datepickerConfig', 'datepickerPopupConfig',
    function($provide, datepickerConfig, datepickerPopupConfig) {
        datepickerConfig.showWeeks = false;
        datepickerPopupConfig.showButtonBar = false;

        $provide.decorator('datepickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'datepicker.html';
            return $delegate;
        }]);
        $provide.decorator('daypickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'day.html';
            return $delegate;
        }]);
        $provide.decorator('monthpickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'month.html';
            return $delegate;
        }]);
        $provide.decorator('yearpickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = 'year.html';
            return $delegate;
        }]);

    }
]);
