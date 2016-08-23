const angular = window.angular;

import template from './template.html';
import RunDistributionController from './controller';
import RunDistributionModal from './modal';

/**
 * RunDistribution Module.
 * @module RunDistribution
 */
const RunDistribution = angular.module('RunDistribution', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * RunDistribution Modal
 * @module RunDistribution
 * @name RunDistribution.Modal
 * @type {service}
 */
RunDistribution.value('RunDistribution.ModalOptions', {
    template: template,
    controller: RunDistributionController,
    size: 'lg'
});

RunDistribution.controller('RunDistribution.Controller', RunDistributionController);
RunDistribution.service('RunDistribution.Modal', RunDistributionModal);

export default RunDistribution;
