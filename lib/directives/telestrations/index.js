
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations', []);

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-template.html', require('./template.html'));
    }
]);

// Directives
Telestrations.directive('telestrations', require('./directive'));

// Sub-Directives
require('telestration-controls');
require('glyph');

// Constants
Telestrations.value('TELESTRATIONS_CONSTANTS', require('./constants'));
