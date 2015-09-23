import template from './template.html';
import controller from './controller';

/**
 * Styleguide Video state config.
 * @module Video
 * @type {UI-Router}
 */
function StyleguideVideoState ($stateProvider) {

    const name = 'Styleguide.Video';
    const parent = 'Styleguide';
    const url = '/video';

    const views = {
        'content@Styleguide': {
            template,
            controller
        }
    };

    const StyleguideVideoStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideVideoStateDefinition);
}

StyleguideVideoState.$inject = [
    '$stateProvider'
];

export default StyleguideVideoState;
