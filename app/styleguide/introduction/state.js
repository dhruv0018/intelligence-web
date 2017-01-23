import controller from './controller';

/**
 * Styleguide Introduction state config.
 * @module StyleguideIntroduction
 * @type {UI-Router}
 */
function StyleguideIntroductionState ($stateProvider) {

    const name = 'Styleguide.Introduction';
    const parent = 'Styleguide';
    const url = '';

    const views = {
        'content@Styleguide': {
            templateUrl: 'app/styleguide/introduction/template.html',
            controller
        }
    };

    const StyleguideIntroductionStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideIntroductionStateDefinition);
}

StyleguideIntroductionState.$inject = [
    '$stateProvider'
];

export default StyleguideIntroductionState;
