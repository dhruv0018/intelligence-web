import template from './template.html';

/**
 * Styleguide Buttons state config.
 * @module StyleguideButtons
 * @type {UI-Router}
 */
function StyleguideButtonsState ($stateProvider) {

    const name = 'Styleguide.Buttons';
    const parent = 'Styleguide';
    const url = '/buttons';

    const views = {
        'content@Styleguide': {
            template
        }
    };

    const StyleguideButtonsStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideButtonsStateDefinition);
}

StyleguideButtonsState.$inject = [
    '$stateProvider'
];

export default StyleguideButtonsState;
