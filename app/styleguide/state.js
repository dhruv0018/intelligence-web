import template from './template.html';

/**
 * Styleguide state config.
 * @module Styleguide
 * @type {UI-Router}
 */
function StyleguideState ($stateProvider) {

    const name = 'Styleguide';
    const parent = 'base';
    const url = '/styleguide';

    const views = {
        'main@root': {
            template
        }
    };

    const StyleguideStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideStateDefinition);
}

StyleguideState.$inject = [
    '$stateProvider'
];

export default StyleguideState;
