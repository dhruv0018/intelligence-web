/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Lib module.
 * @module Lib
 */
const Lib = angular.module('Lib', [
    'Features'
]);

import Features from './features';

export default Lib;
