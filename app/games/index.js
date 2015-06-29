/* Fetch angular from the browser scope */
const angular = window.angular;


require('raw-film');
require('breakdown');
require('down-and-distance');
require('game-info');
require('stats');
require('formations');
require('shot-chart');

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
    'Games.ShotChart'
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
                '$state', '$stateParams', 'SessionService', 'GamesFactory',
                function($state, $stateParams, session, games) {

                    let currentUser = session.currentUser;
                    let gameId = Number($stateParams.id);
                    let game = games.get(gameId);

                    if (!game.isAllowedToView()) {
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
                    'GamesFactory',
                    'TeamsFactory',
                    'UsersFactory',
                    'LeaguesFactory',
                    'CustomtagsFactory',
                    'SessionService',
                    'AuthenticationService',
                    function(
                        $q,
                        $stateParams,
                        games,
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

                            let Data = {
                                leagues: leagues.load()
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

Games.controller('Games.controller', [
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
    'ROLES',
    function controller(
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
        let breakdownShared = game.publicShare && game.publicShare.isBreakdownShared || game.isSharedWithUser(currentUser) && game.getShareByUser(currentUser).isBreakdownShared;
        let uploader = users.get(game.uploaderUserId);
        let uploaderIsCoach = uploader.is(ROLES.COACH);
        let isUploader = game.isUploader(currentUser.id);
        let isTeamUploadersTeam = game.isTeamUploadersTeam(currentUser.currentRole.teamId);
        let isCoach = currentUser.is(ROLES.COACH);
        let isTelestrationsSharedWithCurrentUser = game.isTelestrationsSharedWithUser(currentUser);
        let isTelestrationsSharedPublicly = game.isTelestrationsSharedPublicly();


        /* Scope */

        $scope.game = game;
        $scope.teams = teams.getCollection();
        $scope.team = $scope.teams[game.teamId];
        $scope.opposingTeam = $scope.teams[game.opposingTeamId];
        $scope.league = league;

        // services
        $scope.auth = auth;

        // Telestrations Permissions

        // uploader could be a coach or an athlete (they have permissions to edit by default)
        if (isUploader) {

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

            // statistics related states
            if (game.isDelivered()) {

                if (sport.hasStatistics) {

                    $scope.gameStates.push({name: 'Games.Stats'});
                }

                // sport specific states
                switch (sport.id) {
                    case SPORTS.BASKETBALL.id:
                        $scope.gameStates.push({name: 'Games.ShotChart'});
                        break;
                    case SPORTS.FOOTBALL.id:
                        $scope.gameStates.push({name: 'Games.Formations'}, {name: 'Games.DownAndDistance'});
                        break;
                }
            }
        }

        // video related states
        if (transcodeCompleted) {

            $scope.gameStates.unshift({name: 'Games.RawFilm'});

            if (game.isDelivered()) {

                $scope.gameStates.unshift({name: 'Games.Breakdown'});

                //handles public sharing
                if (!breakdownShared && !isTeamUploadersTeam) {

                    $scope.gameStates.shift();
                }
            }
        }
    }
]);
