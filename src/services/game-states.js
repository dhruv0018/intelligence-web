var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage the plan start and end date
 * @module IntelligenceWebClient
 * @name GameStatesService
 * @type {service}
 */
IntelligenceWebClient.factory('GameStatesService', GameStatesService);

GameStatesService.$inject = [
    'Features',
    'TeamsFactory',
    'LeaguesFactory',
    'SessionService',
    'SPORTS',
    'SPORT_IDS',
    'ROLES',
    'ROLE_TYPE',
    'SELF_EDITOR_TEAM_ID_WHITELIST'
];

function GameStatesService (
    features,
    teams,
    leagues,
    session,
    SPORTS,
    SPORT_IDS,
    ROLES,
    ROLE_TYPE,
    SELF_EDITOR_TEAM_ID_WHITELIST
) {

    return {

        get: function getStates(game) {

            let states = [];
            let currentUser = session.getCurrentUser();
            let isCoach = currentUser.is(ROLES.COACH);
            let isAthlete = currentUser.is(ROLES.ATHLETE);
            let uploaderTeam = teams.get(game.uploaderTeamId);
            let league = leagues.get(uploaderTeam.leagueId);
            let sport = SPORTS[SPORT_IDS[league.sportId]];
            let uploaderTeamIsOnSelfEditorWhitelist = SELF_EDITOR_TEAM_ID_WHITELIST.some(whitelistId => uploaderTeam.id === whitelistId);
            let isDelivered = game.isDelivered();
            let transcodeCompleted = game.video.isComplete();
            let breakdownShared = game.publicShare && game.publicShare.isBreakdownShared || game.isBreakdownSharedWithCurrentUser();

            let isTeamUploadersTeam = false;
            if (isCoach) {
                isTeamUploadersTeam = game.isTeamUploadersTeam(session.getCurrentTeamId());
            } else if (isAthlete) {
                let athleteRoles = currentUser.getRoles(ROLE_TYPE.ATHLETE);
                isTeamUploadersTeam = athleteRoles.some(role => game.isTeamUploadersTeam(role.teamId));
            }

            // Enable features for the game for coaches that are on the uploaders team
            if (isTeamUploadersTeam && isCoach) {
                // game information
                states.push({name: 'Games.Info'});
            }

            // statistics related states
            if (isTeamUploadersTeam && isDelivered && sport.hasStatistics) {
                states.push({name: 'Games.Stats'});
            }

            if (isTeamUploadersTeam && isDelivered) {
                // sport specific states
                switch (sport.id) {
                    case SPORTS.BASKETBALL.id:
                        if (features.isEnabled('ArenaChart')) {
                            states.push({name: 'Games.ArenaChart'});
                        }
                        break;
                    case SPORTS.LACROSSE.id:
                        if (features.isEnabled('ArenaChart')) {
                            states.push({name: 'Games.ArenaChart'});
                        }
                        break;
                    case SPORTS.FOOTBALL.id:
                        if (isCoach) {
                            states.push({name: 'Games.Formations'}, {name: 'Games.DownAndDistance'});
                        }
                        break;
                }
            }

            //video related states
            if (transcodeCompleted) {

                states.unshift({name: 'Games.RawFilm'});

                if (isDelivered) {

                    states.unshift({name: 'Games.Breakdown'});

                    //handles public sharing
                    if (!breakdownShared && !isTeamUploadersTeam) {

                        states.shift();
                    }
                }

                if (isTeamUploadersTeam && isCoach && features.isEnabled('SelfEditor') && uploaderTeamIsOnSelfEditorWhitelist) {

                    // self editor
                    states.push({name: 'Games.SelfEditor'});
                }
            }

            return states;
        }
    };
}