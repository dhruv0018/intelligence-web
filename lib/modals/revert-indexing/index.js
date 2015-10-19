/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
import template from './template.html.js';
const templateUrl = 'revert-indexing/template.html';

/* Module Imports */
import RevertToIndexingController from './controller';
import RevertToIndexingModel from './modal';

/**
 * RevertToIndexing Module.
 * @module RevertToIndexing
 */
const RevertToIndexing = angular.module('RevertToIndexing', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
RevertToIndexing.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * RevertToIndexing Modal
 * @module RevertToIndexing
 * @name RevertToIndexing.Modal
 * @type {service}
 */
RevertToIndexing.value('RevertToIndexing.ModalOptions', {
    templateUrl: templateUrl,
    controller: RevertToIndexingController
});

RevertToIndexing.controller('RevertToIndexing.Controller', RevertToIndexingController);
RevertToIndexing.service('RevertToIndexing.Modal', RevertToIndexingModel);

export default RevertToIndexing;
