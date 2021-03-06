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
    'SessionService', 'config', 'DetectDeviceService', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory', 'SchoolsFactory', '$location',
    function (session, config, deviceDetect, teams, sports, leagues, schools, $location) {

        return {

            mixpanelInit: false,

            /**
             * Identifies the current user (email, userID, roles, team,
             * league, sport, and season) and reports to Mixpanel.
             * @return undefined
             */
            identify: function () {
                let pageView      = $location.path().split('/').pop();
                let user          = session.retrieveCurrentUser() || {id:'', email:''};
                let teamId        = '';
                let teamName      = '';
                let leagueId      = '';
                let sportId       = '';
                let sportName     = '';
                let leagueName    = '';
                let gender        = '';
                let regionCode    = '';
                let schoolType    = '';
                let planName      = '';
                let planActive    = false;
                let packageActive = false;
                let school        = null;
                let device        = deviceDetect.getDevice();
                let browser       = navigator.userAgent;

                teamId = session.getCurrentTeamId() || '';

                if (teamId) {
                    let team = teams.get(teamId) || '';

                    if(team){
                        teamName = team.name;
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

                            try{
                                school = schools.get(team.schoolId);
                            }
                            catch(err){
                                school = undefined;
                            }

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
                        gender = leagues.get(leagueId).gender || '';
                    }
                }

                if (this.mixpanelInit === false) {
                    if (config.environment === 'production') {
                        mixpanel.init("06fdd4c1e4d1baf096d98290f074ada0");
                    }
                    else {
                        mixpanel.init("57bd88dde32a14e2cc7927512974f37c");
                    }

                    this.mixpanelInit  = true;
                }

                mixpanel.register({
                    'Email'           : user.email,
                    'User ID'         : user.id,
                    'User Name'       : user.firstName+' '+user.lastName,
                    'Web Version'     : pkg.version,
                    'Account Created' : moment.utc(user.createdAt).format('MM/YY'),
                    'Role Created'    : moment.utc(user.currentRole.createdAt).format('MM/YY'),
                    'Role Name'       : user.currentRole.type.name,
                    'Role ID'         : user.currentRole.type.id,
                    'League ID'       : leagueId,
                    'Gender'          : gender,
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
                    'Team Name'       : teamName,
                    'Device'          : device,
                    'Browser'         : browser,
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
