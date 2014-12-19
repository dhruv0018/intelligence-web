/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesBreakdown = angular.module('Games.Breakdown', []);

GamesBreakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/breakdown/template.html', require('./template.html'));
    }
]);

GamesBreakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var GamesBreakdown = {
            name: 'Games.Breakdown',
            url: '/breakdown',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/breakdown/template.html',
                    controller: 'Games.Breakdown.controller'
                }
            },
            resolve: {

                'Games.Breakdown.Data': [
                    '$q', '$stateParams', 'Games.Data.Dependencies',
                    function($q, $stateParams, data) {
                        return $q.all(data($stateParams).load());
                    }
                ]
            }
        };

        $stateProvider.state(GamesBreakdown);
    }
]);

GamesBreakdown.service('Games.Data.Dependencies', [
    '$q', 'AuthenticationService', 'GamesFactory', 'PlaysFactory', 'TeamsFactory', 'ReelsFactory', 'LeaguesFactory', 'TagsetsFactory', 'PlayersFactory', 'FiltersetsFactory', 'UsersFactory', 'SessionService',
    function dataService($q, auth, games, plays, teams, reels, leagues, tagsets, players, filtersets, users, session) {

        var service = function(stateParams) {

            var obj = {

                load: function() {
                    var currentUser = session.currentUser;
                    var userId = session.currentUser.id;
                    var teamId = currentUser.currentRole.teamId;

                    var gameId = Number(stateParams.id);

                    return games.load(gameId).then(function() {

                        var game = games.get(gameId);

                        var Data = {
                            user: users.load(game.uploaderUserId),
                            team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId])
                        };

                        var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
                        Data.loadTeamPlayers = players.load(teamPlayersFilter);

                        var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
                        Data.loadOpposingTeamPlayers = players.load(opposingTeamPlayersFilter);

                        if (auth.isLoggedIn) {

                            Data.reels =  reels.load({
                                teamId: teamId,
                                userId: userId
                            });
                        }

                        var playsFilter = { gameId: game.id };
                        Data.loadPlays = plays.load(playsFilter);

                        // TODO: Fix this, really slow because of nesting
                        Data.league = Data.team.then(function() {
                            var uploaderTeam = teams.get(game.uploaderTeamId);
                            return leagues.fetch(uploaderTeam.leagueId);
                        });

                        Data.filterSet = Data.league.then(function() {
                            var uploaderTeam = teams.get(game.uploaderTeamId);
                            var uploaderLeague = leagues.get(uploaderTeam.leagueId);
                            return filtersets.fetch(uploaderLeague.filterSetId);
                        });

                        Data.tagset = tagsets.load();

                        return $q.all(Data);
                    });
                }
            };

            return obj;
        };

        return service;
    }
]);

GamesBreakdown.controller('Games.Breakdown.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', 'AuthenticationService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'PlayersFactory', 'PlaysFactory', 'FiltersetsFactory', 'ReelsFactory', 'VIEWPORTS', 'PlayManager', 'Games.Breakdown.Data',
    function controller($rootScope, $scope, $state, $stateParams, auth, games, teams, leagues, users, players, plays, filtersets, reels, VIEWPORTS, playManager, data) {


        var gameId = $stateParams.id;
        $scope.game = games.get(gameId);
        $scope.publiclyShared = false;
        $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.league = leagues.get($scope.uploaderTeam.leagueId);

        $scope.reels = auth.isLoggedIn ? reels.getList() : [];
        $scope.playManager = playManager;
        $scope.videoTitle = 'filmBreakdown';
        $scope.VIEWPORTS = VIEWPORTS;
        $scope.orderBy = $scope.reverseOrder ? '-startTime' : 'startTime';

        //Todo remove some of this later
        $scope.publiclyShared = true;
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        $scope.uploadedBy = users.get($scope.game.uploaderUserId);

        $scope.sources = $scope.game.getVideoSources();
        $scope.filmTitle = $scope.game.description;

        //TODO remove when we modify the directives to utilize the factories instead of passing through the scope
        if ($scope.game.isDelivered()) {
            $scope.filterset = filtersets.get($scope.league.filterSetId);
            // Players
            var teamPlayersFilter = { rosterId: $scope.game.getRoster($scope.game.teamId).id };
            $scope.teamPlayers = players.getList(teamPlayersFilter);

            var opposingTeamPlayersFilter = { rosterId: $scope.game.getRoster($scope.game.opposingTeamId).id };
            $scope.opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);

            // Plays
            var playsFilter = { gameId: $scope.game.id };
            $scope.totalPlays = plays.getList(playsFilter);
            $scope.plays = $scope.totalPlays;

            $scope.filteredPlaysIds = [];

            $scope.expandAll = false;
        }
    }
]);


