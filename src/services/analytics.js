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

        console.log('$analytics', $analytics);
        return {

            /**
             * Identifies the current user (email, userID, roles, team,
             * league, sport, and season) and reports to Mixpanel (via segment.io).
             * @return undefined
             */
            identify: function () {

                let user     = session.retrieveCurrentUser();
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
                    Email          : user.email,
                    UserID         : user.id,
                    WebVersion     : pkg.version,
                    AccountCreated : '', // TODO: need this!
                    RoleName       : user.currentRole.type.name,
                    RoleTeam       : teamId,
                    LeagueID       : leagueId,
                    Sport          : sport,
                    CurrentSeason  : '' // TODO: need this!
                });
            },

            /**
             * Tracks the user event that has just occurred and reports
             * to Mixpanel (via segment.io).
             * @param {String} category  - The section of the application the event originated (e.g. 'Account', 'Breakdown').
             * @param {String} action    - The action performed to initate the event (e.g. 'Selected', 'Filtered', etc.).
             * @param {String} label     - The item or target of the event action.
             * @param {String} pageInfo  - Info about the page.
             * @param {String} property1 - Extra property.
             * @param {String} property2 - Extra propert.
             * @return undefined
             */
            track: function (category, action, label, pageInfo, property1, property2) {

                $analytics.eventTrack(action, {
                    'Category'  : category,
                    'Label'     : label,
                    'Page Info' : pageInfo || '',
                    'Property'  : property1 || '',
                    'Property2' : property2 || ''
                });
            }
        };
    }
]);
