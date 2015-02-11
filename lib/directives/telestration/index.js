require('glyph');
require('telestration-menu');

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestration = angular.module('Telestration', [
    'Glyph',
    'TelestrationMenu'
]);

// Template Caching
Telestration.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-template.html', require('./template.html'));
    }
]);

// Factories
// Telestration.factory('TelestrationFactory', require('./factory'));

// Services
Telestration.service('TelestrationInterface', require('./service'));

// Directives
Telestration.directive('telestration', require('./directive'));
