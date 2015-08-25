import template from './template';
import controller from './controller';

/**
 * Styleguide Dialogs state config.
 * @module Styleguide.Dialogs
 * @type {UI-Router}
 */
function StyleguideDialogsState ($stateProvider) {

    const name = 'Styleguide.Dialogs';
    const parent = 'Styleguide';
    const url = '/dialogs';

    const views = {
        'content@Styleguide': {
            template,
            controller
        }
    };

    const StyleguideDialogsStateDefinition = {
        name,
        url,
        parent,
        views
    };

    $stateProvider.state(StyleguideDialogsStateDefinition);
}

StyleguideDialogsState.$inject = [
    '$stateProvider'
];

export default StyleguideDialogsState;
