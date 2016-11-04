const angular = window.angular;

import Directives from './directives';
import Features from './features';
import Filters from './filters';
import Modals from './modals';

/**
 * Lib module.
 * @module Lib
 */
const Lib = angular.module('Lib', [
    'Features',
    'Modals',
    'Filters',
    'Directives'
]);

export default Lib;
