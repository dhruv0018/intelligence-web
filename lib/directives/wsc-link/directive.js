const templateUrl = 'wsc-link/template.html';
let restrict = 'E';

let scope = {
    forReel: '=?',
    forGame: '=?',
    forSeason: '=?'
};

let definition = {
    restrict,
    templateUrl,
    scope
};

export default () => definition;
