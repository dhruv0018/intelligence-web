var pkg = require('../../package.json');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to handle segment.io analytics for user information
 * to be reported when various events occur.
 * @module IntelligenceWebClient
 * @name AnalyticsService
 * @type {service}
 */

IntelligenceWebClient.service('AnalyticsService', [
    'SessionService', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory', '$analytics',
    function (session, teams, sports, leagues, $analytics) {

        console.log('Analytics Service working!');

        return {
            identify: function () {

                console.log('Indentifying user...');
                let user = session.retrieveCurrentUser();
                console.log('Current User:', user);
                let teamId   = user.currentRole.teamId || '';
                let leagueId = '';
                let sport    = '';

                try {
                    leagueId = teams.get(teamId).leagueId;
                    sport    = leagues.get(leagueId).sportId;
                } catch (e) {
                    console.log(e.message);
                }

                $analytics.setUserProperties(user.id, {
                    Email: user.email,
                    UserID: user.id,
                    WebVersion: pkg.version,
                    AccountCreated: '', // need this!
                    RoleName: user.currentRole.type.name,
                    RoleTeam: teamId,
                    LeagueID: leagueId,
                    Sport: sport,
                    CurrentSeason: '' // need this!
                });
            }
        };
    }
]);
