
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-controls-template.html', require('./template.html'));
    }
]);

// Sub-Directives
require('telestration-enable-button');
require('telestration-clear-all-button');
require('telestration-delete-button');
require('telestration-toolbar');

// Directives
Telestrations.directive('telestrationControls', [
    function() {
        return {
            restrict: 'E',
            require: 'telestrations',
            scope: true,
            templateUrl: 'telestration-controls-template.html',
            controller: require('./controller'),
            controllerAs: 'controls'
        };
    }
]);
