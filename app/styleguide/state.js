import controller from './controller';

/**
 * Styleguide state config.
 * @module Styleguide
 * @type {UI-Router}
 */

StyleguideState.$inject = [
    '$stateProvider'
];

function StyleguideState ($stateProvider) {

    const name = 'Styleguide';
    const url = '/styleguide';

    const views = {
        'root': {
            templateUrl: 'app/styleguide/template.html',
            controller
        }
    };

    const StyleguideStateDefinition = {
        name,
        url,
        views,
        abstract: true,
        defaultChild: 'Styleguide.Introduction'
    };

    $stateProvider.state(StyleguideStateDefinition);
}

export default StyleguideState;
