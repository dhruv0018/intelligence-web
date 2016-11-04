/* Component dependencies */
import AthleteProfileEditProfileContact from './contact/index.js';
import AthleteProfileEditProfilePhysical from './physical/index.js';
import AthleteProfileEditProfileExperience from './experience/index.js';
import AthleteProfileEditProfileBasciInfo from './basic-info/index.js';
import AthleteProfileEditProfileAcademics from './academics/index.js';

import AthleteProfileEditProfileController from './controller';

/* Fetch angular from the browser scope */
const angular = window.angular;
const AthleteProfileEditProfileTemplateUrl = 'app/athlete/profile/edit-profile/template.html';


/**
 * Edit Profile page module.
 * @module Edit Profile
 */
const EditProfile = angular.module('Athlete.Profile.EditProfile', [
    'Athlete.Profile.EditProfile.BasicInfo',
    'Athlete.Profile.EditProfile.Academics',
    'Athlete.Profile.EditProfile.Experience',
    'Athlete.Profile.EditProfile.Physical',
    'Athlete.Profile.EditProfile.Contact',
    'ui.router',
    'ui.bootstrap',
    'no-results'
]);

/**
 * Athlete Edit Profile Data service.
 * @module Athlete.Profile.EditProfile
 * @type {service}
 */
EditProfile.service('Athlete.Profile.EditProfile.Data.Dependencies', [
    '$q', 'SportsFactory', 'TeamsFactory', 'PositionsetsFactory', 'UsersFactory', 'SessionService',
    function($q, sports, teams, positionsets, users, session) {

        let Data = {

            sports: sports.load(),
            positionsets: positionsets.load()
        };

        if (session.currentUser.profile.teams.length) {
            let teamIds = session.currentUser.profile.teams.map(function(team) {
                return team.teamId;
            });

            Data.teams = teams.load(teamIds);
        }

        return Data;

    }
]);

/**
 * Edit Profile page state router.
 * @module Edit Profile
 * @type {UI-Router}
 */
EditProfile.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile', {
            url: '/edit-profile',
            abstract: true,
            views: {
                'main@root': {
                    templateUrl: AthleteProfileEditProfileTemplateUrl,
                    controller: AthleteProfileEditProfileController
                }
            },
            resolve: {
                'Athlete.Profile.EditProfile.Data': [
                    '$q', 'Athlete.Profile.EditProfile.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);
