import template from './template.html';
import controller from './controller';
const restrict = 'E';

const scope = {
    isSelfEditing: '=',
    game: '='
};

const definition = {
    restrict,
    template,
    controller,
    controllerAs: 'ctrl',
    bindToController: true,
    scope
};

export default () => definition;
