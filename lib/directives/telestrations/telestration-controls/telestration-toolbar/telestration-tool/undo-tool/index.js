/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('undo-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('undoTool', [
    function() {
        return {
            restrict: 'E',
            require: '^telestrations',
            templateUrl: 'undo-tool-template.html',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.removeLast = telestrationsController.removeLast;
            }
        };
    }
]);
