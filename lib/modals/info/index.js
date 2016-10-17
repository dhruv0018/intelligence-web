const angular = window.angular;

import AssistantInfo from './assistant-info';
import AthelteInfo from './athlete-info';

/**
 * Info  module.
 * @module Info
 */
const Info = angular.module('Info', [
    'AssistantInfo',
    'AthleteInfo'
]);

export default Info;
