import template from './template.html';
import controller from './controller';

/**
 * Styleguide Custom state config.
 * @module StyleguideCustom
 * @type {UI-Router}
 */
function StyleguideCustomState ($stateProvider) {

    const name = 'Styleguide.Custom';
    const parent = 'Styleguide';
    const url = '/custom';

    const views = {
        'content@Styleguide': {
            template,
            controller
        }
    };

    const StyleguideCustomStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideCustomStateDefinition);
}

StyleguideCustomState.$inject = [
    '$stateProvider'
];

export default StyleguideCustomState;
