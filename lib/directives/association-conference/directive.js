const templateUrl = 'association-conference/template.html';
import controller from './controller.js';
let restrict = 'E';

let scope = {
    conference: '=',
    competitionLevels: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
