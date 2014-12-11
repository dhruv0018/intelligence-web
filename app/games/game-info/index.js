/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesInfo = angular.module('Games.Info', []);

GamesInfo.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/game-info.html', require('./template.html'));
    }
]);

GamesInfo.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameInfo = {
            name: 'Games.Info',
            url: '/information',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/game-info.html',
                    controller: 'GamesInfo.controller'
                }
            },
            resolve: {
                'Games.Info.Data': [
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'SessionService', 'PlayersFactory',
                    function($q, $stateParams, games, teams, users, session, players) {
                        var gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);
                            var teamId = session.currentUser.currentRole.teamId;

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.teamId, game.opposingTeamId]),
                                game: game
                            };

                            Data.gamePlayerLists = {};
                            //Player lists
                            if (Data.game.teamId && Data.game.rosters && Data.game.rosters[Data.game.teamId].id) {
                                Data.teamPlayerList = players.query({
                                    rosterId: Data.game.rosters[Data.game.teamId].id
                                }).then(function(playerList) {
                                    Data.teamPlayers = playerList;
                                    Data.gamePlayerLists[Data.game.teamId] = playerList;
                                });
                            }

                            if (Data.game.opposingTeamId && Data.game.rosters && Data.game.rosters[Data.game.opposingTeamId].id) {
                                Data.opposingTeamPlayerList = players.query({
                                    rosterId: Data.game.rosters[Data.game.opposingTeamId].id
                                }).then(function(playerList) {
                                    Data.opposingTeamPlayers = playerList;
                                    Data.gamePlayerLists[Data.game.opposingTeamId] = playerList;
                                });
                            }

                            //todo will look into getting rid of this again later, but for these
                            //resolves to be standalone it's needed
                            Data.remainingBreakdowns = teams.getRemainingBreakdowns(teamId).then(function(breakdownData) {
                                session.currentUser.remainingBreakdowns = breakdownData;
                                return breakdownData;
                            });

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameInfo);

    }
]);

GamesInfo.controller('GamesInfo.controller', [
    '$scope', '$state', '$stateParams', '$modal', 'AlertsService', 'SessionService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'Games.Info.Data', 'uploadManager',
    function controller($scope, $state, $stateParams, $modal, alerts, session, games, teams, leagues, Data, uploadManager) {
        $scope.game = games.get($stateParams.id);
        $scope.game.flow = uploadManager.get($scope.game.id);
        $scope.returnedDate = ($scope.game.isDelivered()) ? new Date($scope.game.currentAssignment().timeFinished) : null;
        $scope.league = leagues.get(teams.get(session.currentUser.currentRole.teamId).leagueId);
        $scope.remainingBreakdowns = Data.remainingBreakdowns;

        //Player List
        $scope.teamPlayerList = Data.gamePlayerLists[$scope.game.teamId];
        $scope.opposingPlayerList = Data.gamePlayerLists[$scope.game.opposingTeamId];
    }
]);
