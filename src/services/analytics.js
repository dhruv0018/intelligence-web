const pkg    = require('../../package.json');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * to be reported when various events occur.
 * @module IntelligenceWebClient
 * @name AnalyticsService
 * @type {service}
 */

IntelligenceWebClient.service('AnalyticsService', [
    'SessionService', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory', 'SchoolsFactory', '$location',
    function (session, teams, sports, leagues, schools, $location) {

        return {

            /**
             * Identifies the current user (email, userID, roles, team,
             * league, sport, and season) and reports to Mixpanel.
             * @return undefined
             */
            identify: function () {
                let pageView      = $location.path().split('/').pop();
                let user          = session.retrieveCurrentUser() || {id:'', email:''};
                let teamId        = '';
                let leagueId      = '';
                let sportId       = '';
                let sportName     = '';
                let leagueName    = '';
                let regionCode    = '';
                let schoolType    = '';
                let planName      = '';
                let planActive    = false;
                let packageActive = false;
                let school        = null;

                teamId = session.getCurrentTeamId() || '';

                if (teamId) {
                    let team = teams.get(teamId);

                    if(team){
                        let activePlan = team.getActivePlan();
                        let activePackage = team.getActivePackage();

                        if(activePlan){
                            planName = activePlan.name || '';
                            planActive = true;
                        }

                        if(activePackage){
                            packageActive = true;
                        }

                        if(team.schoolId){
                            school = schools.get(team.schoolId);

                            if(school){
                                if(school.address){
                                    regionCode = school.address.regionCode || '';
                                }

                                if(school.type){
                                    schoolType = school.type.id || '';
                                }
                            }
                        }
                    }

                    leagueId = team.leagueId || '';

                    if (leagueId) {
                        sportId  = leagues.get(leagueId).sportId || '';
                        sportName  = sports.get(sportId).name || '';
                        leagueName = leagues.get(leagueId).name || '';
                    }
                }

                mixpanel.register({
                    'Email'           : user.email,
                    'User ID'         : user.id,
                    'Web Version'     : pkg.version,
                    'Account Created' : moment.utc(user.createdAt).format('MM/YY'),
                    'Role Created'    : moment.utc(user.currentRole.createdAt).format('MM/YY'),
                    'Role Name'       : user.currentRole.type.name,
                    'Role ID'         : user.currentRole.type.id,
                    'League ID'       : leagueId,
                    'Sport'           : sportId,
                    'Region Code'     : regionCode,
                    'School Type'     : schoolType,
                    'Plan Active'     : planActive,
                    'Package Active'  : packageActive,
                    'Sport Name'      : sportName,
                    'League Name'     : leagueName,
                    'Customer Type'   : planName,
                    'Page View'       : pageView,
                    'Team ID'         : teamId,
                    'Current Season'  : '' // TODO: need this!
                });

                Appcues.identify(user.id, {
                    WebVersion       : pkg.version,
                    AccountCreated   : moment.utc(user.createdAt).format('MM/YY'),
                    RoleCreated      : moment.utc(user.currentRole.createdAt).format('MM/YY'),
                    RoleName         : user.currentRole.type.name,
                    Sport            : sportId,
                    LeagueID         : leagueId,
                    RegionCode       : regionCode,
                    PlanName         : planName,
                    PlanActive       : planActive,
                    PackageActive    : packageActive,
                    RoleID           : user.currentRole.type.id,
                    RoleTeam         : teamId,
                    Email            : user.email,
                    SchoolType       : schoolType
                });
            },

            /**
             * Tracks the user event that has just occurred and reports
             * to Mixpanel.
             * @param {Object} event - The details of the event to track:
             * @return undefined
             */

            track: function (action, event) {
                mixpanel.track(action, event);
            }
        };
    }
]);
