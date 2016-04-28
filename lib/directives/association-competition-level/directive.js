const templateUrl = 'association-competition-level/template.html';
import controller from './controller.js';
let restrict = 'E';

let scope = {
    competitionLevel: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
