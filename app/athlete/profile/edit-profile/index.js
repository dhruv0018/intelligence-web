/* Component dependencies */
require('basic-info');
require('academics');
require('experience');
require('physical');
require('contact');

/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/template.html';

const template = require('./template.html');

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
    'ngMaterial',
    'no-results'
]);

/* Cache the template files */
EditProfile.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
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

/* File dependencies */
require('./config');
require('./controller');
