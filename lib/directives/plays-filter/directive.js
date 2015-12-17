import template from './template.html';

function PlaysFilterDirective() {

    const restrict = 'E';
    const scope = {
        name: '@'
    };

    return {

        restrict,
        scope,
        template
    };
}

export default PlaysFilterDirective;
