const angular = window.angular;


import AssociationController from './association';
import AssociationsController from './associations';

/**
 * Associations page module.
 * @module Associations
 */
const Associations = angular.module('associations', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
Associations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('association.html', require('./association.html'));
        $templateCache.put('associations.html', require('./associations.html'));
        $templateCache.put('association-info.html', require('./association-info.html'));
        $templateCache.put('conferences.html', require('./conferences.html'));
    }
]);

/**
 * Associations page state router.
 * @module Associations
 * @type {UI-Router}
 */
Associations.config([
    '$stateProvider',
    '$urlRouterProvider',
    function config(
        $stateProvider,
        $urlRouterProvider
    ) {

        $stateProvider

            .state('associations', {
                url: '/associations',
                parent: 'base',
                views: {
                    'main@root': {
                        templateUrl: 'associations.html',
                        controller: AssociationsController
                    }
                }
            })

            .state('association', {
                url: '/association/:code',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'association.html',
                        controller: AssociationController
                    }
                },
                resolve: {
                    'Associations.Data': [
                        '$stateParams',
                        '$q',
                        'AssociationsFactory',
                        'TeamsFactory',
                        'Iso3166countriesFactory',
                        function(
                            $stateParams,
                            $q,
                            associations,
                            teams,
                            iso3166countries
                        ) {

                            let associationCode = $stateParams.code;

                            let Data = {};

                            if (associationCode) {

                                Data.association = associations.load({code: associationCode});
                            }

                            Data.iso3166countries = iso3166countries.load();

                            return $q.all(Data);
                        }
                    ]
                }
            })

            .state('association-info', {
                url: '',
                parent: 'association',
                views: {
                    'content@association': {
                        templateUrl: 'association-info.html',
                        controller: AssociationController
                    }
                }
            })

            .state('conferences', {
                url: '',
                parent: 'association',
                views: {
                    'content@association': {
                        templateUrl: 'conferences.html',
                        controller: AssociationController
                    }
                }
            });
    }
]);
