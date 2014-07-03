/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Player
 * @module Add Player
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
 * Add Player directive.
 * @module Add Player
 * @name Add Player
 * @type {Directive}
 */
addPlayer.directive('addPlayer', [
    function directive() {

        var addplayer = {

            restrict: TO += ELEMENTS,

            templateUrl: 'add-player.html',

            scope: {
                addNewPlayer: '&'
            },
            link: function(scope, element, attrs) {

            }
        };

        return addplayer;
    }
]);

