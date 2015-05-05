/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'athlete-resume.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AthleteResume
 * @module AthleteResume
 */
const AthleteResume = angular.module('AthleteResume', []);

/* Cache the template file */
AthleteResume.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * AthleteResume directive.
 * @module AthleteResume
 * @name AthleteResume
 * @type {directive}
 */
AthleteResume.directive('athleteResume', [
    function directive() {

        const AthleteResume = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            controller: 'AthleteResume.Controller',

            scope: {
                athlete: '='
            }
        };

        return AthleteResume;
    }
]);

/**
 * AthleteResume Data service.
 * @module AthleteResume
 * @type {service}
 */
AthleteResume.service('AthleteResume.Data.Dependencies', [
    '$q',
    '$filter',
    'SportsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'PositionsetsFactory',
    'UsersFactory',
    'SessionService',
    function(
            $q,
            $filter,
            sports,
            leagues,
            teams,
            positionsets,
            users,
            session) {

        let profileTeams = [];

        if (session.currentUser.profile.teams) {
            let teamIds = session.currentUser.profile.teams.map(function(team) {
                return team.teamId;
            });

            profileTeams = teams.load(teamIds);
        }

        let Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            teams: profileTeams,
            positionsets: positionsets.load()
        };

        return Data;

    }
]);


/* File dependencies */
require('./controller');
