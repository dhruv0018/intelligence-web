import template from './template.html';
import controller from './controller';

/**
 * Styleguide Indexing state config.
 * @module StyleguideIndexing
 * @type {UI-Router}
 */
function StyleguideIndexingState ($stateProvider) {

    const name = 'Styleguide.Indexing';
    const parent = 'Styleguide';
    const url = '/Indexing';

    const views = {
        'content@Styleguide': {
            template,
            controller
        }
    };

    const StyleguideIndexingStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideIndexingStateDefinition);
}

StyleguideIndexingState.$inject = [
    '$stateProvider'
];

export default StyleguideIndexingState;
