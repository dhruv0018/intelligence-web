/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/team-player-dropdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamPlayerDropdown
 * @module TeamPlayerDropdown
 */
var TeamPlayerDropdown = angular.module('Item.TeamPlayerDropdown', []);

/* Cache the template file */
TeamPlayerDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('item/team-player-dropdown-input.html', require('./team-player-dropdown-input.html'));
    }
]);

/**
 * TeamPlayerDropdown directive.
 * @module TeamPlayerDropdown
 * @name TeamPlayerDropdown
 * @type {Directive}
 */
TeamPlayerDropdown.directive('krossoverItemTeamPlayerDropdown', [
    function directive() {
        var TeamPlayerDropdown = {
            restrict: TO += ELEMENTS,
            templateUrl: templateUrl
        };
        return TeamPlayerDropdown;
    }
]);
