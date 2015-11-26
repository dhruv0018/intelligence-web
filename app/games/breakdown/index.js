/* Fetch angular from the browser scope */
const angular = window.angular;

const GamesBreakdown = angular.module('Games.Breakdown', []);

GamesBreakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('games/breakdown/template.html', require('./template.html'));
    }
]);

GamesBreakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const GamesBreakdown = {
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
                    let gameId = $stateParams.id;
                    let game = games.get(gameId);
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
    '$q',
    'GamesFactory',
    'PlaysFactory',
    'TeamsFactory',
    'ReelsFactory',
    'LeaguesFactory',
    'TagsetsFactory',
    'PlayersFactory',
    'FiltersetsFactory',
    'UsersFactory',
    'SessionService',
    'AuthenticationService',
    function dataService(
        $q,
        games,
        plays,
        teams,
        reels,
        leagues,
        tagsets,
        players,
        filtersets,
        users,
        session,
        auth
    ) {

        let service = function(stateParams) {

            let obj = {

                load: function() {

                    let gameId = Number(stateParams.id);
                    let userId = session.getCurrentUserId();
                    let teamId = session.getCurrentTeamId();

                    let Data = {
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

                        let game = games.get(gameId);

                        let GameData = {
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
    'PlaylistEventEmitter',
    'TELESTRATION_PERMISSIONS',
    'TelestrationsVideoPlayerBroker',
    'EVENT'
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
    playlistEventEmitter,
    TELESTRATION_PERMISSIONS,
    TelestrationsVideoPlayerBroker,
    EVENT
) {

        let uploader = users.get($scope.game.uploaderUserId);
        let gameId = $stateParams.id;
        $scope.game = games.get(gameId);

        $scope.posterImage = {
            url: $scope.game.video.thumbnail
        };

        const telestrationsVideoPlayerBroker = new TelestrationsVideoPlayerBroker();

        let isUploader = session.getCurrentUserId() === $scope.game.uploaderUserId;
        let isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;
        let isACoachOfUploadersTeam = session.currentUser.is(ROLES.COACH) && isTeamMember;

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

        let removeTelestrationsSaveListener = angular.noop;

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
                playManager.current = play;
            }

            $scope.currentVideo = play.clip;

            // Set telestrations
            $scope.telestrationsEntity = $scope.game.playTelestrations;
            $scope.currentPlayId = play.id;

            /* Telestrations associated with plays */

            $scope.plays.forEach((play) => {
                play.hasTelestrations = $scope.game.playTelestrations.some((telestration) => play.id === telestration.playId && telestration.hasGlyphs());
            });

            // set initial cuepoints
            if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

                $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints($scope.currentPlayId, play.startTime);
            }

            /* TODO: Remove this sessionStorage once playIds
             * is a valid back-end property on the games object.
             *
             * Storing playIds in session storage so Clips.Controller can
             * attach playIds array to game object to mirror reels properties
             * BEWARE: It only contains viewable, i.e. has a clip, plays
             */

            let playIds = $scope.plays
                .filter(function(play) {
                    return play.clip !== null;
                })
                .sort(function(first, second) {
                    return first.startTime - second.startTime;
                })
                .map(function(play) {
                    return play.id;
                });
            let jsonPlayIds = JSON.stringify(playIds);
            $window.sessionStorage.setItem(
                'game.plays',
                jsonPlayIds
            );

            $scope.filteredPlaysIds = [];

            $scope.expandAll = false;


            /* Listeners & Watches */

            if ($scope.telestrationsPermissions !== TELESTRATION_PERMISSIONS.NO_ACCESS) {

                playlistEventEmitter.on(EVENT.PLAYLIST.PLAY.CURRENT, onPlaylistWatch);
            }

            if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

                $scope.$on('telestrations:updated', function handleTelestrationsUpdated(event) {

                    if (playManager.current) {

                        $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(playManager.current.id, playManager.current.startTime);
                    }
                });
            }

            /* Listeners & Watches */

            if ($scope.telestrationsPermissions === TELESTRATION_PERMISSIONS.EDIT) {

                removeTelestrationsSaveListener = $scope.$on('telestrations:save', saveTelestrations);
            }
        }

        function saveTelestrations(event, callbackFn) {

            callbackFn = callbackFn || angular.noop;

            // Save Game
            $scope.game.save(null, null, null, true).then(function onSaved() {
                callbackFn();
            });

        }

        function onPlaylistWatch(play) {

            if (play && play.id) {

                $scope.cuePoints = $scope.telestrationsEntity.getTelestrationCuePoints(play.id, play.startTime);
                $scope.currentPlayId = play.id;
            }
        }

        $scope.$on('$destroy', function onDestroy() {

            removeTelestrationsSaveListener();
            telestrationsVideoPlayerBroker.cleanup();
            playlistEventEmitter.removeListener(EVENT.PLAYLIST.PLAY.CURRENT, onPlaylistWatch);
        });
}
