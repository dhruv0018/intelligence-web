const templateUrl = 'wsc-link/template.html';
import controller from './controller.js';
let restrict = 'E';

let scope = {
    reelId: '=?',
    gameId: '=?',
    seasonId: '=?',
    team: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
