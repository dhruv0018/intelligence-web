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
                    '$stateParams', 'Games.Data.Dependencies',
                    function($stateParams, data) {
                        return data($stateParams).load();
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

                    var gameId = Number(stateParams.id);
                    var userId = session.getCurrentUserId();
                    var teamId = session.getCurrentTeamId();

                    var Data = {
                        leagues: leagues.load(),
                        tagsets: tagsets.load(),
                        filtersets: filtersets.load(),
                        plays: plays.load({ gameId: gameId }),
                        players: players.load({ gameId: gameId })
                    };

                    if (auth.isLoggedIn) {

                        Data.reels = reels.load({
                            teamId: teamId,
                            userId: userId
                        });
                    }

                    Data.game = games.load(gameId).then(function() {

                        var game = games.get(gameId);

                        var GameData = {
                            users: users.load(game.uploaderUserId),
                            teams: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId])
                        };

                        return $q.all(GameData);
                    });

                    return $q.all(Data);
                }
            };

            return obj;
        };

        return service;
    }
]);

GamesBreakdown.controller('Games.Breakdown.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', 'AuthenticationService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'PlayersFactory', 'PlaysFactory', 'FiltersetsFactory', 'ReelsFactory', 'VIEWPORTS', 'PlayManager',
    function controller($rootScope, $scope, $state, $stateParams, auth, games, teams, leagues, users, players, plays, filtersets, reels, VIEWPORTS, playManager) {

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
            /* Attaching playIds array to game object to mirror reels properties
             * This array is utilized on the clips page for clips navigation
             * BEWARE: It only contains viewable, i.e. has a clip, plays
             */
            $scope.game.plays = $scope.plays
            .filter(function(play) {
                return play.clip !== null;
            })
            .sort(function(first, second) {
                return first.startTime - second.startTime;
            })
            .map(function(play) {
                return play.id;
            });

            $scope.filteredPlaysIds = [];

            $scope.expandAll = false;
        }

    }
]);


