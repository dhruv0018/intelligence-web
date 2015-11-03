/* Fetch angular from the browser scope */
const angular = window.angular;


require('raw-film');
require('breakdown');
require('down-and-distance');
require('game-info');
require('stats');
require('formations');
require('arena-chart');

/**
* Coach game area raw film page module.
* @module Games
*/
const Games = angular.module('Games', [
    'Games.RawFilm',
    'Games.Breakdown',
    'Games.DownAndDistance',
    'Games.Info',
    'Games.Stats',
    'Games.Formations',
    'Games.ArenaChart'
]);

Games.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/template.html', require('./template.html'));
        $templateCache.put('games/restricted.html', require('./restricted.html'));
    }
]);

Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const shortGames = {
            name: 'ShortGames',
            url: '/g/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var gameId = parseInt($stateParams.id, 36);
                    $state.go('Games', {id: gameId});
                }
            ]
        };

        const GamesRestricted = {
            name: 'Games.Restricted',
            url: 'games/:id/restricted',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'games/restricted.html'
                }
            }
        };

        const Games = {
            name: 'Games',
            url: '/games/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams', 'SessionService', 'GamesFactory', 'ROLES', 'ROLE_TYPE',
                function($state, $stateParams, session, games, ROLES, ROLE_TYPE) {

                    let currentUser = session.currentUser;
                    let gameId = Number($stateParams.id);
                    let game = games.get(gameId);
                    let teamIds = [];

                    // TODO: make user factory function to handle this
                    if (currentUser.is(ROLES.ATHLETE)) {
                        // Get all teams user is athlete on
                        let athleteRoles = currentUser.getRoles(ROLE_TYPE.ATHLETE);
                        teamIds = athleteRoles.map(role => role.teamId);
                    } else {
                        teamIds = [session.getCurrentTeamId()];
                    }

                    if (!game.isAllowedToView(teamIds, currentUser.id)) {
                        $state.go('Games.Restricted', { id: gameId });
                    }
                }
            ],
            onExit: [
                'PlayManager',
                function(playManager) {
                    playManager.clear();
                }
            ],
            views: {
                'main@root': {
                    templateUrl: 'games/template.html',
                    controller: 'Games.controller'
                }
            },
            resolve: {
                'Games.Data': [
                    '$q',
                    '$stateParams',
                    'PositionsetsFactory',
                    'GamesFactory',
                    'ReelsFactory',
                    'TeamsFactory',
                    'UsersFactory',
                    'LeaguesFactory',
                    'CustomtagsFactory',
                    'SessionService',
                    'AuthenticationService',
                    function(
                        $q,
                        $stateParams,
                        positionsets,
                        games,
                        reels,
                        teams,
                        users,
                        leagues,
                        customtags,
                        session,
                        auth
                    ) {

                        let gameId = Number($stateParams.id);

                        return games.load(gameId).then(function() {

                            let game = games.get(gameId);
                            const currentUserId = session.getCurrentUserId();

                            let Data = {
                                leagues: leagues.load(),

                                positionsets: positionsets.load(),

                                reels: reels.load({ relatedUserId: currentUserId })
                            };

                            //Load custom tags
                            let teamId = session.getCurrentTeamId();

                            if (auth.isLoggedIn && teamId) {
                                Data.customtags = customtags.load({ teamId: teamId });
                            }

                            let userIds = [];
                            userIds.push(game.uploaderUserId);
                            game.getUserShares().forEach(function(share) {

                                userIds.push(share.sharedWithUserId);
                            });
                            if (userIds.length) Data.users = users.load(userIds);

                            let teamIds = [];
                            if (game.teamId) teamIds.push(game.teamId);
                            if (game.opposingTeamId) teamIds.push(game.opposingTeamId);
                            if (game.uploaderTeamId) teamIds.push(game.uploaderTeamId);
                            if (teamIds.length) Data.teams = teams.load(teamIds);

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(shortGames);
        $stateProvider.state(GamesRestricted);
        $stateProvider.state(Games);
    }
]);

GamesController.$inject = [
    'Features',
    'DEVICE',
    '$rootScope',
    'TELESTRATION_PERMISSIONS',
    '$scope',
    '$state',
    '$stateParams',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'UsersFactory',
    'AuthenticationService',
    'SessionService',
    'SPORTS',
    'SPORT_IDS',
    'ROLES'
];

function GamesController(
    features,
    DEVICE,
    $rootScope,
    TELESTRATION_PERMISSIONS,
    $scope,
    $state,
    $stateParams,
    games,
    teams,
    leagues,
    users,
    auth,
    session,
    SPORTS,
    SPORT_IDS,
    ROLES
) {

    let gameId = Number($stateParams.id);
    let game = games.get(gameId);
    let team = teams.get(game.uploaderTeamId);
    let league = leagues.get(team.leagueId);
    let currentUser = session.getCurrentUser();
    let sport = SPORTS[SPORT_IDS[league.sportId]];
    let transcodeCompleted = game.isVideoTranscodeComplete();
    let breakdownShared = game.publicShare && game.publicShare.isBreakdownShared || game.isBreakdownSharedWithCurrentUser();
    let uploader = users.get(game.uploaderUserId);
    let uploaderIsCoach = uploader.is(ROLES.COACH);
    let isUploader = game.isUploader(currentUser.id);
    let isTeamUploadersTeam = game.isTeamUploadersTeam(currentUser.currentRole.teamId);
    let isCoach = currentUser.is(ROLES.COACH);
    let isTelestrationsSharedWithCurrentUser = game.isTelestrationsSharedWithUser(currentUser);
    let isTelestrationsSharedPublicly = game.isTelestrationsSharedPublicly();
    let isMobile = $rootScope.DEVICE === DEVICE.MOBILE;
    let isDelivered = game.isDelivered();

    /* Scope */

    $scope.game = game;
    $scope.teams = teams.getCollection();
    $scope.team = $scope.teams[game.teamId];
    $scope.opposingTeam = $scope.teams[game.opposingTeamId];
    $scope.league = league;

    // services
    $scope.auth = auth;

    // Telestrations Permissions
    if (isMobile) {
        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.NO_ACCESS;
    }
    // uploader could be a coach or an athlete (they have permissions to edit by default)
    else if (isUploader) {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.EDIT;

    }
    // Coaches on the same team as the uploader can edit
    else if (isTeamUploadersTeam && isCoach) {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.EDIT;

    } else if (isTelestrationsSharedWithCurrentUser || isTelestrationsSharedPublicly) {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.VIEW;

    } else {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.NO_ACCESS;
    }

    /* Define view selector states */

    $scope.gameStates = [];

    // Enable features for the game for coaches that are on the uploaders team
    if (isTeamUploadersTeam && isCoach) {

        // game information
        $scope.gameStates.push({name: 'Games.Info'});
    }

    // statistics related states
    if (isTeamUploadersTeam && isDelivered && sport.hasStatistics) {

        $scope.gameStates.push({name: 'Games.Stats'});
    }

    if (isTeamUploadersTeam && isDelivered) {
        // sport specific states
        switch (sport.id) {
            case SPORTS.BASKETBALL.id:
                if (features.isEnabled('ArenaChart')) {
                    $scope.gameStates.push({name: 'Games.ArenaChart'});
                }
                break;
            case SPORTS.FOOTBALL.id:
                if (isCoach) {
                    $scope.gameStates.push({name: 'Games.Formations'}, {name: 'Games.DownAndDistance'});
                }
                break;
        }
    }

    //video related states
    if (transcodeCompleted) {

        $scope.gameStates.unshift({name: 'Games.RawFilm'});

        if (isDelivered) {

            $scope.gameStates.unshift({name: 'Games.Breakdown'});

            //handles public sharing
            if (!breakdownShared && !isTeamUploadersTeam) {

                $scope.gameStates.shift();
            }
        }
    }

}

Games.controller('Games.controller', GamesController);
