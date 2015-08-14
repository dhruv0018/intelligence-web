const pkg    = require('../../package.json');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

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

        return {

            /**
             * Identifies the current user (email, userID, roles, team,
             * league, sport, and season) and reports to Mixpanel (via segment.io).
             * @return undefined
             */
            identify: function () {

                let user     = session.retrieveCurrentUser();
                let teamId   = '';
                let leagueId = '';
                let sportId  = '';

                // TODO: This should be safe to call without the try/catch
                // block. Find out why and fix it.
                try {

                    teamId = session.getCurrentTeamId();
                } catch (e) {

                    return;
                }

                if (teamId) {

                    leagueId = teams.get(teamId).leagueId || '';
                }

                if (leagueId) {

                    sportId  = leagues.get(leagueId).sportId || '';
                }

                $analytics.setUserProperties(user.id, {
                    Email          : user.email,
                    UserID         : user.id,
                    WebVersion     : pkg.version,
                    AccountCreated : moment.utc(user.createdAt).format('MM/YY'),
                    RoleCreated    : moment.utc(user.currentRole.createdAt).format('MM/YY'),
                    RoleName       : user.currentRole.type.name,
                    RoleTeam       : teamId,
                    LeagueID       : leagueId,
                    Sport          : sportId,
                    CurrentSeason  : '' // TODO: need this!
                });
            },

            /**
             * Tracks the user event that has just occurred and reports
             * to Mixpanel (via segment.io).
             * @param {Object} event - The details of the event to track:
             * category  - The section of the application the event originated (e.g. 'Account', 'Breakdown').
             * action    - The action performed to initate the event (e.g. 'Selected', 'Filtered', etc.).
             * label     - The item or target of the event action.
             * pageInfo  - Info about the page.
             * property1 - Extra property.
             * property2 - Extra property.
             * @return undefined
             */
            track: function (event) {

                $analytics.eventTrack(event.action, {
                    'Category'  : event.category,
                    'Label'     : event.label,
                    'Page Info' : event.pageInfo || '',
                    'Property'  : event.property1 || '',
                    'Property2' : event.property2 || ''
                });
            }
        };
    }
]);
