/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Public Footer
 * @module Public Footer
 */
var publicFooter = angular.module('public-footer', []);

/* Cache the template file */
publicFooter.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('public-footer.html', template);
    }
]);

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

            templateUrl: 'public-footer.html',

        };

        function link($scope, element, attrs) {
            $scope.config = config;
            $scope.now = moment.utc().toDate();
        }

        return publicFooter;
    }
]);
