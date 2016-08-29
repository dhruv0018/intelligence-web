const angular = window.angular;

import HeaderController from './controller';
import HeaderDataDependencies from './data';

const HeaderTemplateUrl = 'app/header/template.html';

/**
 * Header
 * @module Header
 */
const Header = angular.module('header', [
    'ui.router',
    'ui.bootstrap'
]);

Header.factory('HeaderDataDependencies', HeaderDataDependencies);

/**
 * Header state router.
 * @module Header
 * @type {UI-Router}
 */
Header.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('base', {
                url: '',
                parent: 'root',
                abstract: true,
                views: {
                    'header@root': {
                        templateUrl: HeaderTemplateUrl,
                        controller: HeaderController
                    }
                },
                resolve: {
                    'Header.Data': [
                        '$q', 'HeaderDataDependencies',
                        function($q, HeaderDataDependencies) {
                            //let data = new HeaderDataDependencies();
                            return $q.all(HeaderDataDependencies);
                        }
                    ]
                }
            });
    }
]);

export default Header;
