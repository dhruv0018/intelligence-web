/* Fetch angular from the browser scope */
var angular = window.angular;


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
var Games = angular.module('Games', [
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

        var shortGames = {
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

        var GamesRestricted = {
            name: 'Games.Restricted',
            url: 'games/:id/restricted',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'games/restricted.html'
                }
            }
        };

        var Games = {
            name: 'Games',
            url: '/games/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams', 'SessionService', 'GamesFactory',
                function($state, $stateParams, session, games) {

                    var currentUser = session.currentUser;
                    var gameId = Number($stateParams.id);
                    var game = games.get(gameId);

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
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'LeaguesFactory',
                    function($q, $stateParams, games, teams, users, leagues) {

                        var gameId = Number($stateParams.id);

                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);

                            var Data = {
                                leagues: leagues.load()
                            };

                            var userIds = [];
                            userIds.push(game.uploaderUserId);
                            game.getUserShares().forEach(function(share) {

                                userIds.push(share.sharedWithUserId);
                            });
                            if (userIds.length) Data.users = users.load(userIds);

                            var teamIds = [];
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
    '$scope', '$state', '$stateParams', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'SPORTS', 'SPORT_IDS', 'AuthenticationService', 'SessionService', 'ROLES',
    function controller($scope, $state, $stateParams, games, teams, leagues, users, SPORTS, SPORT_IDS, auth, session, ROLES) {
        $scope.game = games.get($stateParams.id);

        $scope.teams = teams.getCollection();
        $scope.team = $scope.teams[$scope.game.teamId];
        $scope.opposingTeam = $scope.teams[$scope.game.opposingTeamId];

        //todo alex -- remove this when it is not needed for header
        $scope.isPublic = true;

        $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.league = leagues.get($scope.uploaderTeam.leagueId);
        $scope.auth = auth;
        var currentUser = session.currentUser;

        //define states for view selector
        $scope.gameStates = [];

        var sport = SPORTS[SPORT_IDS[$scope.league.sportId]];
        var transcodeCompleted = $scope.game.isVideoTranscodeComplete();
        var gameDelivered = $scope.game.isDelivered();
        var gameBelongsToUserTeam = $scope.game.uploaderTeamId === currentUser.currentRole.teamId;
        var sharedWithCurrentUser = $scope.game.isSharedWithUser(currentUser);
        var breakdownShared = $scope.game.publicShare && $scope.game.publicShare.isBreakdownShared || sharedWithCurrentUser && $scope.game.getShareByUser(currentUser).isBreakdownShared;

        if (gameBelongsToUserTeam && currentUser.is(ROLES.COACH)) {
            //game information
            $scope.gameStates.push({name: 'Games.Info'});

            //statistics related states
            if (gameDelivered) {
                if (sport.hasStatistics) {
                    $scope.gameStates.push({name: 'Games.Stats'});
                }
                //sport specific states
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

        //video related states
        if (transcodeCompleted) {

            $scope.gameStates.unshift({name: 'Games.RawFilm'});

            if (gameDelivered) {
                $scope.gameStates.unshift({name: 'Games.Breakdown'});

                //handles public sharing
                if (!breakdownShared && !gameBelongsToUserTeam) {
                    $scope.gameStates.shift();
                }
            }
        }

    }
]);
