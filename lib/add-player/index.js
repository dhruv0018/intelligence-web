/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Plan
 * @module Plan
 */
var addPlayer = angular.module('add-player', []);

/* Cache the template file */
addPlayer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-player.html', template);
    }
]);

/**
 * Plan directive.
 * @module Plan
 * @name Plan
 * @type {Directive}
 */
addPlayer.directive('addPlayer', [
    function directive() {

        var addplayer = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            templateUrl: 'add-player.html'
        };

        return addplayer;
    }
]);

