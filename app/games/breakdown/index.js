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
            },
            onEnter: [
                '$stateParams', 'PlayerlistManager', 'GamesFactory',
                function($stateParams, playerlist, games) {
                    var gameId = $stateParams.id;
                    var game = games.get(gameId);
                    playerlist.fill(game);
                }
            ],
            onExit: [
                'PlayerlistManager',
                function(playerlist) {
                    playerlist.clear();
                }
            ]
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

                    if (auth.isLoggedIn && userId && teamId) {

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
    '$rootScope', '$scope', '$window', '$state', '$stateParams', 'AuthenticationService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'UsersFactory', 'PlayersFactory', 'PlaysFactory', 'FiltersetsFactory', 'ReelsFactory', 'VIEWPORTS', 'PlayManager', 'PlaysManager', 'ROLES', 'SessionService', 'TELESTRATION_PERMISSIONS',
    function controller($rootScope, $scope, $window, $state, $stateParams, auth, games, teams, leagues, users, players, plays, filtersets, reels, VIEWPORTS, playManager, playsManager, ROLES, session, TELESTRATION_PERMISSIONS) {

        var uploader = users.get($scope.game.uploaderUserId);

        $scope.posterImage = {
            url: $scope.game.video.thumbnail
        };

        $scope.cuePoints = [];

        $scope.publiclyShared = false;

        /* TODO: figure out if this stuff is used */
        $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.league = leagues.get($scope.uploaderTeam.leagueId);

        $scope.reels = auth.isLoggedIn ? reels.getList() : [];
        $scope.playManager = playManager;
        $scope.VIEWPORTS = VIEWPORTS;
        $scope.orderBy = $scope.reverseOrder ? '-startTime' : 'startTime';

        // TODO: remove some of this later
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        $scope.filmTitle = $scope.game.description;

        //TODO remove when we modify the directives to utilize the factories instead of passing through the scope
        if ($scope.game.isDelivered()) {

            // Plays
            var playsFilter = { gameId: $scope.game.id };

            $scope.totalPlays = plays.getList(playsFilter);
            $scope.plays = plays.getList(playsFilter);
            playsManager.reset($scope.plays);
            var play = playsManager.plays[0];

            // Set telestrations
            $scope.telestrationsEntity = $scope.game.playTelestrations;
            $scope.currentPlayId = play.id;

            $scope.sources = play.getVideoSources();

            /* TODO: Remove this sessionStorage once playIds
             * is a valid back-end property on the games object.
             *
             * Storing playIds in session storage so Clips.Controller can
             * attach playIds array to game object to mirror reels properties
             * BEWARE: It only contains viewable, i.e. has a clip, plays
             */

            var playIds = $scope.plays
                .filter(function(play) {
                    return play.clip !== null;
                })
                .sort(function(first, second) {
                    return first.startTime - second.startTime;
                })
                .map(function(play) {
                    return play.id;
                });
            var jsonPlayIds = JSON.stringify(playIds);
            $window.sessionStorage.setItem(
                'game.plays',
                jsonPlayIds
            );

            $scope.filteredPlaysIds = [];

            $scope.expandAll = false;


            /* Listeners & Watches */

            if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

                $scope.$watchCollection('playManager.current', function(currentPlay) {

                    if (currentPlay && currentPlay.id) {

                        $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(currentPlay.id);
                        $scope.currentPlayId = currentPlay.id;
                        // TODO: add back event cuepoint an concat with play cuepoints
                        // var eventCuePoints = play.getEventCuePoints();
                        // $scope.cuePoints = $scope.cuepoints.concat(eventCuePoints);
                    }
                });
            }

            if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

                $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

                    $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(playManager.getCurrentPlayId());
                });
            }
        }
    }
]);
