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
                            teams: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId]),
                            roster: players.load({ rosterId: game.getRoster(game.teamId).id }),
                            opposingRoster: players.load({ rosterId: game.getRoster(game.opposingTeamId).id })
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

GamesBreakdown.controller('Games.Breakdown.controller', GamesBreakdownController);

GamesBreakdownController.$inject = [
    '$rootScope',
    '$scope',
    '$window',
    '$state',
    '$stateParams',
    'ROLES',
    'Utilities',
    'SessionService',
    'AuthenticationService',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'UsersFactory',
    'PlayersFactory',
    'PlaysFactory',
    'FiltersetsFactory',
    'ReelsFactory',
    'VIEWPORTS',
    'PlayManager',
    'PlaysManager',
    'PlaylistManager',
    'TELESTRATION_PERMISSIONS',
    'TelestrationsVideoPlayerBroker',
];

function GamesBreakdownController (
    $rootScope,
    $scope,
    $window,
    $state,
    $stateParams,
    ROLES,
    utilities,
    session,
    auth,
    games,
    teams,
    leagues,
    users,
    players,
    plays,
    filtersets,
    reels,
    VIEWPORTS,
    playManager,
    playsManager,
    playlistManager,
    TELESTRATION_PERMISSIONS,
    TelestrationsVideoPlayerBroker
) {

        var uploader = users.get($scope.game.uploaderUserId);

        $scope.posterImage = {
            url: $scope.game.video.thumbnail
        };

        const telestrationsVideoPlayerBroker = new TelestrationsVideoPlayerBroker();

        var isUploader = session.getCurrentUserId() === $scope.game.uploaderUserId;
        var isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;
        var isACoachOfUploadersTeam = session.currentUser.is(ROLES.COACH) && isTeamMember;

        playlistManager.isEditable = isUploader || isACoachOfUploadersTeam;

        /* TODO: figure out if this stuff is used */
        $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
        $scope.league = leagues.get($scope.uploaderTeam.leagueId);

        $scope.reels = auth.isLoggedIn ? reels.getList() : [];
        $scope.VIEWPORTS = VIEWPORTS;
        $scope.orderBy = $scope.reverseOrder ? '-startTime' : 'startTime';

        // TODO: remove some of this later
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        $scope.filmTitle = $scope.game.description;

        //TODO remove when we modify the directives to utilize the factories instead of passing through the scope
        if ($scope.game.isDelivered()) {

            /* TODO: Make this all better */
            // Plays
            let playsFilter = { gameId: $scope.game.id };
            $scope.plays = plays.getList(playsFilter);
            playsManager.reset($scope.plays);
            playsManager.calculatePlays();
            $scope.plays = $scope.plays
            .sort(utilities.compareStartTimes)
            .filter(play => play.hasVisibleEvents);
            $scope.totalPlays = $scope.plays; // TODO: Unnecessary variable?
            let play = $scope.plays[0];
            if (play) {
                $scope.sources = play.getVideoSources();
                playManager.current = play;
            }

            // Set telestrations
            $scope.telestrationsEntity = $scope.game.playTelestrations;
            $scope.currentPlayId = play.id;

            // set initial cuepoints
            if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

                $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints($scope.currentPlayId, play.startTime);
            }

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

                        $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(currentPlay.id, currentPlay.startTime);
                        $scope.currentPlayId = currentPlay.id;
                    }
                });
            }

            if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

                $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

                    if (playManager.current) {

                        $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(playManager.current.id, playManager.current.startTime);
                    }
                });
            }
        }

        $scope.$on('$destroy', function onDestroy() {

            telestrationsVideoPlayerBroker.cleanup();
        });
}
