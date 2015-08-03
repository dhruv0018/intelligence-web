import template from './template.html';

/**
 * Styleguide Typography state config.
 * @module StyleguideTypography
 * @type {UI-Router}
 */
function StyleguideTypographyState ($stateProvider) {

    const name = 'Styleguide.Typography';
    const parent = 'Styleguide';
    const url = '/typography';

    const views = {
        'content@Styleguide': {
            template
        }
    };

    const StyleguideTypographyStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideTypographyStateDefinition);
}

StyleguideTypographyState.$inject = [
    '$stateProvider'
];

export default StyleguideTypographyState;
