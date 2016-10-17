const angular = window.angular;

import AssociationController from './association/association';
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
                        templateUrl: 'app/admin/platform/associations/associations.html',
                        controller: AssociationsController
                    }
                }
            })

            .state('association', {
                url: '/association/:id',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'app/admin/platform/associations/association/association.html',
                        controller: AssociationController
                    }
                },
                resolve: {
                    'Associations.Data': [
                        '$stateParams',
                        '$q',
                        'AssociationsFactory',
                        'SportsFactory',
                        'Iso3166countriesFactory',
                        function(
                            $stateParams,
                            $q,
                            associations,
                            sports,
                            iso3166countries
                        ) {

                            let associationId = Number($stateParams.id);

                            let Data = {};

                            if (associationId) {

                                Data.association = associations.load(associationId);
                                Data.sports = sports.load();
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
                        templateUrl: 'app/admin/platform/associations/association/association-info.html'
                    }
                }
            })

            .state('competition-levels', {
                url: '',
                parent: 'association',
                views: {
                    'content@association': {
                        templateUrl: 'app/admin/platform/associations/association/competition-levels.html'
                    }
                }
            })

            .state('association-conferences', {
                url: '',
                parent: 'association',
                views: {
                    'content@association': {
                        templateUrl: 'app/admin/platform/associations/association/association-conferences.html'
                    }
                }
            })

            .state('film-exchanges', {
                url: '',
                parent: 'association',
                views: {
                    'content@association': {
                        templateUrl: 'app/admin/platform/associations/association/film-exchanges.html'
                    }
                }
            });
    }
]);
