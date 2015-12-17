import template from './template.html';
import controller from './controller';
const restrict = 'E';

const scope = {
    team: '=',
    game: '=',
    cuePoints: '='
};

const definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
