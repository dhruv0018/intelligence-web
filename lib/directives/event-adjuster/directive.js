const templateUrl = 'event-adjuster/template.html';
import controller from './controller';
let restrict = 'E';

let scope = {
    events: '=',
    event: '=',
    video: '=',
    plays: '=',
    play: '='
};

let definition = {
    restrict,
    templateUrl,
    controller,
    scope
};

export default () => definition;
