import template from './template.html';
import controller from './controller';
const restrict = 'E';

const scope = {
    play: '=',
    video: '=',
    showStateActions: '='
};

const definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
