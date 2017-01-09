/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;
const dateTemplateUrl = 'lib/directives/date/template.html';
const dayTemplateUrl = 'lib/directives/date/day.html';
const monthTemplateUrl = 'lib/directives/date/month.html';
const yearTemplateUrl = 'lib/directives/date/year.html';
const datePickerTemplateUrl = 'lib/directives/date/datepicker.html';
const popupTemplateUrl = 'lib/directives/date/popup.html';

/**
 * Add Date
 * @module Date
 */
var DatePicker = angular.module('date', ['ui.bootstrap.datepicker']);

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
                id: '@?',
                placeholder: '@?',
                format: '@?'
            },

            templateUrl: dateTemplateUrl,
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
        $scope.opened = false;
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = !$scope.opened;
        };
    }
]);

DatePicker.directive('uibDatepickerPopup', function() {
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
    '$provide', 'uibDatepickerConfig', 'uibDatepickerPopupConfig',
    function($provide, uibDatepickerConfig, uibDatepickerPopupConfig) {
        uibDatepickerConfig.showWeeks = false;
        uibDatepickerPopupConfig.showButtonBar = false;

        $provide.decorator('uibDatepickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = datePickerTemplateUrl;
            return $delegate;
        }]);
        $provide.decorator('uibDaypickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = dayTemplateUrl;
            return $delegate;
        }]);
        $provide.decorator('uibMonthpickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = monthTemplateUrl;
            return $delegate;
        }]);
        $provide.decorator('uibYearpickerDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = yearTemplateUrl;
            return $delegate;
        }]);
        // TODO: Fixes datepicker issue on popup, remove after angular-bootstrap 1.2 is used
        $provide.decorator('uibDatepickerPopupWrapDirective', ['$delegate', function($delegate) {
            //array of datepicker directives
            $delegate[0].templateUrl = popupTemplateUrl;
            return $delegate;
        }]);

    }
]);

export default DatePicker;
