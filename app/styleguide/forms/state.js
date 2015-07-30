import template from './template.html';

/**
 * Styleguide Forms state config.
 * @module StyleguideForms
 * @type {UI-Router}
 */
function StyleguideFormsState ($stateProvider) {

    const name = 'Styleguide.Forms';
    const parent = 'Styleguide';
    const url = '/forms';

    const views = {
        'content@Styleguide': {
            template
        }
    };

    const StyleguideFormsStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideFormsStateDefinition);
}

StyleguideFormsState.$inject = [
    '$stateProvider'
];

export default StyleguideFormsState;
