import template from './template.html';
import controller from './controller';
const restrict = 'E';

const scope = {
    plays: '=',
    disabled: '=',
    forSelfEditor: '=?'
};

const definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
