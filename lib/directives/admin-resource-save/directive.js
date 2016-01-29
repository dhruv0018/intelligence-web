import template from './template.html';
import controller from './controller';
let restrict = 'E';

let scope = {
    resource: '=',
    disabled: '=',
    buttonId: '@',
    //function which returns a promise
    preSave: '=?'
};

let definition = {
    restrict,
    template,
    controller,
    scope
};

export default () => definition;
