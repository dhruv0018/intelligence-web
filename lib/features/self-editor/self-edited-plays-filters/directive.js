import template from './template.html';
import controller from './controller';
const restrict = 'E';

const scope = {
    plays: '=',
    game: '='
};

const definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
