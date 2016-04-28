const templateUrl = 'association-conference-sport/template.html';
import controller from './controller.js';
let restrict = 'E';

let scope = {
    conferenceSport: '=',
    isEditingConference: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
