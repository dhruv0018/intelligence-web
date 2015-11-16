/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Features module.
 * @module Features
 */
const Features = angular.module('Features', [
    'SelfEditor'
]);

import SelfEditor from './self-editor';

export default Features;
