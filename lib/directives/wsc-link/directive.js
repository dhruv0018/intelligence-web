const templateUrl = 'wsc-link/template.html';
import controller from './controller.js';
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

export default () => definition;
