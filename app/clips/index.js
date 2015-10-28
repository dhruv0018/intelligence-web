/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Public clips page module.
 * @module Clips
 */
var Clips = angular.module('Clips', [
    'ui.router',
    'ui.bootstrap'
]);

Clips.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('clips/template.html', require('./template.html'));
        $templateCache.put('clips/restricted.html', require('./restricted.html'));
    }
]);

Clips.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var shortClips = {
            name: 'ShortClips',
            url: '/c/:id?reel&game',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var clipId = parseInt($stateParams.id, 36);
                    $state.go('Clips', {id: clipId});
                }
            ]
        };

        var ClipsRestricted = {
            name: 'Clips.Restricted',
            url: 'clips/',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'clips/restricted.html'
                }
            }
        };

        var Clips = {
            name: 'Clips',
            url: '/clips/:id?reel&game',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'clips/template.html',
                    controller: 'Clips.controller'
                }
            },
            onEnter: [
                '$state', '$timeout', '$stateParams', 'SessionService', 'ReelsFactory', 'GamesFactory', 'ROLES', 'ROLE_TYPE',
                function($state, $timeout, $stateParams, session, reels, games, ROLES, ROLE_TYPE) {

                    let playId = Number($stateParams.id);
                    let currentUser = session.getCurrentUser();

                    if($stateParams.reel) {

                        let reel = reels.get($stateParams.reel);

                        /*Check if user has permissions to view reel*/
                        if (!reel.isAllowedToView()) {

                            //Without timeout, the read property '@' is null
                            //when using $state in onEnter
                            $timeout(function(){
                                $state.go('Clips.Restricted', { id: playId });
                            });
                        }
                    } else if($stateParams.game) {

                        let game = games.get($stateParams.game);
                        let teamIds = [];

                        // Get all teams user is athlete on
                        if (currentUser.is(ROLES.ATHLETE)) {
                            let athleteRoles = currentUser.roleTypes[ROLE_TYPE.ATHLETE];
                            teamIds = athleteRoles.map(role => role.teamId);
                        } else {
                            teamIds = [session.getCurrentTeamId()];
                        }

                        /*Check if user has permissions to view game*/
                        if (!game.isAllowedToView(teamIds, currentUser.id)) {

                            //Without timeout, the read property '@' is null
                            //when using $state in onEnter
                            $timeout(function(){
                                $state.go('Clips.Restricted', { id: playId });
                            });
                        }
                    }

                }
            ],
            resolve: {
                'Clips.Data': [
                    '$q', '$stateParams', 'GamesFactory', 'TeamsFactory', 'UsersFactory', 'PlaysFactory', 'PlayersFactory', 'LeaguesFactory', 'TagsetsFactory',
                    function($q, $stateParams, games, teams, users, plays, players, leagues, tagsets) {

                        var playId = Number($stateParams.id);

                        return plays.load(playId).then(function() {

                            var play = plays.get(playId);
                            var gameId = play.gameId;

                            return games.load(gameId).then(function() {

                                var game = games.get(gameId);

                                var playersPromise = players.load({ gameId: gameId });

                                var teamsPromise = teams.load([game.teamId, game.opposingTeamId]).then(function() {

                                    var team = teams.get(game.teamId);

                                    return leagues.load(team.leagueId).then(function() {

                                        var league = leagues.get(team.leagueId);

                                        return tagsets.load(league.tagSetId);
                                    });
                                });

                                return $q.all([playersPromise, teamsPromise]);
                            });

                        });
                    }
                ]
            }
        };

        $stateProvider.state(shortClips);
        $stateProvider.state(ClipsRestricted);
        $stateProvider.state(Clips);
    }
]);

Clips.controller('Clips.controller', [
    '$scope', '$window', '$state', '$stateParams', 'GamesFactory', 'ReelsFactory', 'TeamsFactory', 'PlaysFactory', 'LeaguesFactory', 'PlayersFactory', 'PlayManager', 'PlaysManager',
    function controller($scope, $window, $state, $stateParams, games, reels, teams, plays, leagues, players, playManager, playsManager) {

        var playId = $stateParams.id;
        $scope.play = plays.get(playId);
        $scope.plays = [$scope.play];

        // Film Header data-attributes
        $scope.game = games.get($scope.play.gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);

        // Krossover Playlist data-attributes
        $scope.league = leagues.get($scope.team.leagueId);
        $scope.teamPlayers = $scope.game.getTeamPlayers();
        $scope.opposingTeamPlayers = $scope.game.getOpposingTeamPlayers();
        $scope.showHeader = false;
        $scope.showFooter = false;

        // TODO: This should be refactored, code-smell...
        playManager.videoTitle = 'reelsPlayer';

        /* Logic for clips navigation */

        $scope.fromReel = ($stateParams.reel !== null && $stateParams.reel !== undefined);
        $scope.fromGame = ($stateParams.game !== null && $stateParams.game !== undefined);

        if ($scope.fromReel || $scope.fromGame) {

            var playsArray = [];
            var film;

            // Set up film type specific information
            if ($scope.fromReel) {
                $scope.filmId = $stateParams.reel;
                film = reels.get($scope.filmId);
                $scope.filmName = film.name;
            } else if ($scope.fromGame) {
                $scope.filmId = $stateParams.game;
                film = games.get($scope.filmId);
                var jsonPlays = $window.sessionStorage.getItem('game.plays');
                film.plays = JSON.parse(jsonPlays);
                $scope.filmName = teams.get(film.opposingTeamId).name + ' vs. ' + teams.get(film.teamId).name;
            }

            // Populate the array with play objects from playIds
            for (var i = 0; i < film.plays.length; i++) {

                let play = plays.get(film.plays[i]);

                /* Assume all plays in a clip have visible events, this should hold true
                * because they are all added from visible plays on a breakdown. */
                play.hasVisibleEvents = true;

                playsArray.push(play);
            }

            // Load the plays in the plays manager
            playsManager.reset(playsArray);

            // Template information/functions
            $scope.clipIndex = playsManager.getIndex($scope.play) + 1;
            $scope.clipTotal = film.plays.length;
            $scope.previousPlay = playsManager.getPreviousPlay($scope.play);
            $scope.nextPlay = playsManager.getNextPlay($scope.play);

            $scope.goToPlay = function(play) {
                if (play) { // Can be null in first/last play edge cases
                    if ($scope.fromReel) {
                        $state.go('Clips', {id: play.id, reel: $scope.filmId});
                    } else if ($scope.fromGame) {
                        $state.go('Clips', {id: play.id, game: $scope.filmId});
                    }
                }
            };
        }
    }
]);
