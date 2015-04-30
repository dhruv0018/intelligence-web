
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-toolbar-template.html', require('./template.html'));
    }
]);

// require sub-directives
require('telestration-tool');

Telestrations.directive('telestrationToolbar', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'telestration-toolbar-template.html',
            require: '^telestrations',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.telestrationsController = telestrationsController;

                elem.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);
