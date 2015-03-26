
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-activate-button-template.html', require('./template.html'));
    }
]);

// Directives
Telestrations.directive('telestrationActivateButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'telestration-activate-button-template.html',
            link: function telestrationActivateButtonLink(scope, elem, attr) {

                scope.active = false;

                elem.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);
