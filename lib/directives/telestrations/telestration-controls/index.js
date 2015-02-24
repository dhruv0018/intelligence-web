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

/* Define Directive */
Telestrations.directive('telestrationControls', require('./directive'));
