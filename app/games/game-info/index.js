/* Fetch angular from the browser scope */
const angular = window.angular;

const GamesInfo = angular.module('Games.Info', []);

import template from './template.html';

GamesInfo.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const gameInfo = {
            name: 'Games.Info',
            url: '/information?isHomeGame',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    template,
                    controller: 'GamesInfo.controller'
                }
            },
            resolve: {
                'Games.Info.Data': [
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'SessionService', 'PlayersFactory', 'PositionsetsFactory',
                    function($q, $stateParams, games, teams, users, session, players, positionsets) {
                        var gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);
                            var teamId = session.currentUser.currentRole.teamId;

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                positionSets: positionsets.load(),
                                game: game
                            };

                            var teamIds = [];
                            if (game.teamId) teamIds.push(game.teamId);
                            if (game.opposingTeamId) teamIds.push(game.opposingTeamId);
                            if (teamIds.length) Data.teams = teams.load(teamIds);

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

GamesInfo.controller('GamesInfo.controller', GamesInfoController);

GamesInfoController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'SessionService',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'PlayersFactory',
    'Games.Info.Data'
];

function GamesInfoController (
    $scope,
    $state,
    $stateParams,
    $modal,
    session,
    games,
    teams,
    leagues,
    players,
    Data
) {

    $scope.game = games.get($stateParams.id);

    $scope.league = leagues.get(teams.get(session.currentUser.currentRole.teamId).leagueId);

    //TODO special case to remove
    $scope.remainingBreakdowns = Data.remainingBreakdowns;

    //Player List
    $scope.teamPlayerList = ($scope.game.rosters && $scope.game.teamId) ? players.getList({rosterId: $scope.game.rosters[$scope.game.teamId].id }) : [];
    $scope.opposingPlayerList = ($scope.game.rosters && $scope.game.opposingTeamId) ? players.getList({rosterId: $scope.game.rosters[$scope.game.opposingTeamId].id }) : [];
}

export default GamesInfo;
