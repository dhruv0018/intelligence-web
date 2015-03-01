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
            require: ['^telestrations', '^telestrationControls'],
            templateUrl: 'undo-tool-template.html',
            scope: true,
            link: function(scope, elem, attr, controllers) {

                var telestrationsController = controllers[0];
                var telestrationsControlController = controllers[1];

                scope.telestrationControls = telestrationsControlController;
                scope.disabled = true;

                scope.undoClicked = function undoClicked() {

                    telestrationsController.$removeLast();
                };

                scope.$watch(function() {
                    return telestrationsControlController.areGlyphsPresent();
                }, function(areGlyphsPresent) {
                    scope.disabled = areGlyphsPresent ? false : true;
                });
            }
        };
    }
]);
