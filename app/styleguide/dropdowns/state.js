import controller from './controller';

/**
 * Styleguide Dropdowns state config.
 * @module StyleguideDropdowns
 * @type {UI-Router}
 */
function StyleguideDropdownsState ($stateProvider) {

    const name = 'Styleguide.Dropdowns';
    const parent = 'Styleguide';
    const url = '/dropdowns';

    const views = {
        'content@Styleguide': {
            templateUrl: 'app/styleguide/dropdowns/template.html',
            controller
        }
    };

    const StyleguideDropdownsStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideDropdownsStateDefinition);
}

StyleguideDropdownsState.$inject = [
    '$stateProvider'
];

export default StyleguideDropdownsState;
