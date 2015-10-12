const templateUrl = 'event-adjuster/template.html';
import controller from './controller';
let restrict = 'E';

let scope = {
    eventList: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
