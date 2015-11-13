import template from './template.html';
import controller from './controller';
let restrict = 'E';

let scope = {
    resource: '=',
    disabled: '='
};

let definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
