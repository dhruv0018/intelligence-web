/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Date
 * @module Date
 */
var datePick = angular.module('date', []);

/* Cache the template file */
datePick.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('date.html', template);
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

            templateUrl: 'date.html',
            link: function(scope, element, attrs){
                //test func
                element.click(function(){
                    console.log('hello world');
                });

            }
        };

        // $scope.open = function($event) {
        //     //$event.preventDefault();
        //     //$event.stopPropagation();

        //     $scope.opened = true;
        // };

        return datepick;
    }
]);

