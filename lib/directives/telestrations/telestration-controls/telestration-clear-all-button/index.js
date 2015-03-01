
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-clear-all-button-template.html', require('./template.html'));
    }
]);

Telestrations.directive('telestrationClearAllButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'telestration-clear-all-button-template.html',
            require: '^telestrations',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.clearAllButonClicked = function clearAllButonClicked() {

                    telestrationsController.$clearCurrent();

                };
            }
        };
    }
]);
