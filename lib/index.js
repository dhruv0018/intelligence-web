const angular = window.angular;

import Dialogs from './dialogs';
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
    'Directives',
    'Dialogs'
]);

export default Lib;
