/* Constants */
var TO = '';
var ELEMENTS = 'E';


/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Public Footer
 * @module Public Footer
 */
var publicFooter = angular.module('public-footer', []);

/**
 * Public Footer directive.
 * @module Public Footer
 * @name Public Footer
 * @type {Directive}
 */
publicFooter.directive('publicFooter', [
    'config',
    function directive(config) {

        var publicFooter = {

            restrict: TO += ELEMENTS,

            link: link,

            templateUrl: 'lib/directives/public-footer/template.html',

        };

        function link($scope, element, attrs) {
            $scope.config = config;
            $scope.now = moment.utc().toDate();
        }

        return publicFooter;
    }
]);

export default publicFooter;
