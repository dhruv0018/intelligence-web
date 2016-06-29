/* Fetch angular from the browser scope */
const angular = window.angular;

import ConferencesController from './conferences';
import ConferenceController from './conference';

/**
 * conferences page module.
 * @module Conferences
 */
const Conferences = angular.module('Conferences', [
    'ui.router',
    'ui.bootstrap',
    'ui.unique',
    'ui.showhide'
]);

/* Cache the template file */
Conferences.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('conferences.html', require('./conferences.html'));
        $templateCache.put('conference.html', require('./conference.html'));
    }
]);

/**
 * Conferences page state router.
 * @module Conferences
 * @type {UI-Router}
 */
Conferences.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('conferences-list', {
            url: '/conferences',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'conferences.html',
                    controller: ConferencesController
                }
            },
            resolve:{
                'Conference.Data':[
                    'ConferencesFactory',
                    function(conferences){
                        return conferences.getAllConferenceSportsForAssociation();
                    }
                ]
            }
        })

        .state('conference', {
            url: '/conference/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'conference.html',
                    controller: ConferenceController
                }
            }
        });
    }
]);
