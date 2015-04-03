/* Component dependencies */
require('basic-info');
require('academics');
require('experience');
require('physical');
require('contact');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Edit Profile
 */
var EditProfile = angular.module('Athlete.Profile.EditProfile', [
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

        $templateCache.put('athlete/edit-profile/template.html', require('./template.html'));
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

        //TODO: getTeamsByProfileId?
        let teamIds = session.currentUser.profile.teams.map(function(team) {
            return team.teamId;
        });

        let Data = {

            sports: sports.load(),
            teams: teams.load(teamIds),
            positionsets: positionsets.load()
        };

        return Data;

    }
]);

/* File dependencies */
require('./config');
require('./controller');
