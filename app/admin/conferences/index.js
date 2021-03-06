/* Fetch angular from the browser scope */
const angular = window.angular;
const CONFEREENCEPERPAGE = 30; //max number of conferences shown per page

import ConferencesController from './conferences';
import ConferenceController from './conference/conference';

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
                    templateUrl: 'app/admin/conferences/conferences.html',
                    controller: ConferencesController
                }
            },
            resolve:{
                'Conferences.Data':[
                    'ConferencesFactory', '$stateParams',
                    function(conferences, $stateParams) {
                        if($stateParams.page){
                            return conferences.getConferencesList({page: $stateParams.page, count: CONFEREENCEPERPAGE});
                        }else{
                            return conferences.getConferencesList({page: 0, count: CONFEREENCEPERPAGE});
                        }
                    }
                ]
            }
        })
        .state('conference', {
            url: '/conference/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'app/admin/conferences/conference/conference.html',
                    controller: ConferenceController
                }
            },
            resolve:{
                'Conference.Data':[
                    '$q', '$stateParams', 'ConferencesFactory', 'FilmExchangeFactory',
                    function($q, $stateParams, conferences, filmExchanges) {
                        let conferenceFilter = {
                            sportsAssociation: $stateParams.id.split('+')[0],
                            conference: $stateParams.id.split('+')[1],
                            gender: $stateParams.id.split('+')[2],
                            sportId: $stateParams.id.split('+')[3]
                        };

                        let conferencesList = conferences.getConferencesList(conferenceFilter, false);
                        let conferenceTeamsList = conferences.loadTeamsInConference({combinationCode: $stateParams.id});

                        let Data = {
                            conference: conferencesList.then(conferencesListResponse => {
                                return conferencesListResponse.data[0];
                            }),

                            teams: conferenceTeamsList.then(teams => {
                                return teams;
                            }),

                            filmExchangeAdmins: conferencesList.then(conferencesListResponse => {
                                if (conferencesListResponse.data[0].filmExchange) {
                                    return filmExchanges.getFilmExchangeAdmins($stateParams.id).then(admins => {
                                        return admins;
                                    });
                                } else {
                                    return undefined;
                                }
                            })
                        };

                        return $q.all(Data);
                    }
                ]
            }
        });
    }
]);

export default Conferences;
