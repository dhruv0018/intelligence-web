const templateUrl = 'association-film-exchange/template.html';
import controller from './controller.js';
let restrict = 'E';

let scope = {
    filmExchange: '=',
    conference: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
