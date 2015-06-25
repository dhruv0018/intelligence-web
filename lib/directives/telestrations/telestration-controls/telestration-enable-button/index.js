
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-enable-button-template.html', require('./template.html'));
    }
]);

// Directives
Telestrations.directive('telestrationEnableButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'telestration-enable-button-template.html',
            scope: true,
            link: function telestrationEnableButtonLink(scope, element) {

                scope.enabled = false;

                element.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);
