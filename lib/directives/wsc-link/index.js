const angular = window.angular;

const templateUrl = 'lib/directives/wsc-link/template.html';
const WSCLink = angular.module('WSCLink', []);
import controller from './controller.js';

/* WSC Directive */
let restrict = 'E';

let scope = {
    reelId: '=?',
    gameId: '=?',
    leagueId: '=?',
    seasonId: '=?',
    isScoutingGame: '=?',
    teams: '=?'
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

WSCLink.directive('wscLink', () => definition);

export default WSCLink;
