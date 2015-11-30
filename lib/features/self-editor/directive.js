import template from './template.html';
import controller from './controller';
const restrict = 'E';

const scope = {
    indexingMode: '='
};

const definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
