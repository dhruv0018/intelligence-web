const templateUrl = 'event-adjuster/template.html';
import controller from './controller';
let restrict = 'E';

let scope = {
    events: '=',
    event: '=',
    video: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
