/**
 * Styleguide Colors state config.
 * @module StyleguideColors
 * @type {UI-Router}
 */
function StyleguideColorsState ($stateProvider) {

    const name = 'Styleguide.Colors';
    const parent = 'Styleguide';
    const url = '/colors';

    const views = {
        'content@Styleguide': {
            templateUrl: 'app/styleguide/colors/template.html'
        }
    };

    const StyleguideColorsStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideColorsStateDefinition);
}

StyleguideColorsState.$inject = [
    '$stateProvider'
];

export default StyleguideColorsState;
