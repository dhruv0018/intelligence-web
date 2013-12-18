/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Alertbar
 * @module Alertbar
 */
var Alertbar = angular.module('alertbar', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Alertbar.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('alertbar.html', template);
    }
]);

/**
 * Alertbar directive.
 * @module Alertbar
 * @name Alertbar
 * @type {Directive}
 */
Alertbar.directive('alertbar', [
    '$rootScope', 'AlertsService',
    function directive($rootScope, alerts) {

        var Alertbar = {

            restrict: TO += ELEMENTS,

            templateUrl: 'alertbar.html',

            link: function($scope, element, attributes) {

                $scope.alerts = alerts.alerts;

                $rootScope.$on('alert', function(event, alert) {

                    alerts.add(alert);

                });

                $scope.close = function(index) {

                    alerts.remove(index);
                };
            }
        };

        return Alertbar;
    }
]);

