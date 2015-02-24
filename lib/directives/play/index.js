/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var templateUrl = 'play.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play', [
    'Events',
    'ui.bootstrap'
]);

/* Cache the template file */
Play.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Play directive.
 * @module Play
 * @name Play
 * @type {directive}
 */
Play.directive('krossoverPlay', [
    'SessionService', 'ROLES', 'LeaguesFactory', 'GamesFactory', 'TeamsFactory', 'EventEmitter', 'EVENT_MAP', 'EventManager', 'PlayManager', 'PlayVideoMediator', 'CurrentEventMediator',
    function directive(session, ROLES, leagues, games, teams, emitter, EVENT_MAP, eventManager, playManager, playVideoMediator, currentEventMediator) {

        var Play = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            replace: false,
            scope: {
                play: '=',
                plays: '=?', // Only necessary for indexing
                reels: '=?',
                expandAll: '=?',
                isReelsPlay: '=?',
                filteredPlaysIds: '=?',
                autoAdvance: '=?',
                editFlag: '=?',
                index: '=?',
                cuePoints: '=?'
            },

            link: link,

            controller: 'Play.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {
            var play = $scope.play;
            var gameId = $scope.play.gameId;
            var homeTeamId = games.get(gameId).teamId;
            var opposingTeamId = games.get(gameId).opposingTeamId;

            $scope.team = teams.get(homeTeamId);
            $scope.opposingTeam = teams.get(opposingTeamId);

            $scope.league = leagues.get($scope.team.leagueId);
            $scope.game = games.get(play.gameId);

            $scope.playElement = element;
            $scope.playsContainerElement = element.parent();

            $scope.options = {scope: $scope};

            $scope.teams = {};
            $scope.teams[$scope.game.teamId] = $scope.team;
            $scope.teams[$scope.game.opposingTeamId] = $scope.opposingTeam;

            $scope.play.period = $scope.play.period || $scope.game.currentPeriod;

            $scope.play.teamPointsAssigned = $scope.play.teamPointsAssigned || 0;
            $scope.play.opposingPointsAssigned = $scope.play.opposingPointsAssigned || 0;

            $scope.play.teamIndexedScore = $scope.play.teamIndexedScore || 0;
            $scope.play.opposingIndexedScore = $scope.play.opposingIndexedScore || 0;

            $scope.play.isFiltered = true;

            var isIndexer = session.currentUser.is(ROLES.INDEXER);

            /* Watch the team score in the previous play. */
            /* Only watch if there are plays and user is an indexer */
            if (isIndexer && $scope.plays) {
                $scope.$watch(function() {
                    var playIndex = $scope.plays.indexOf($scope.play);
                    var previousPlay = $scope.plays[playIndex - 1];

                    if (!previousPlay) return 0;

                    var teamIndexedScore = previousPlay.teamIndexedScore || 0;

                    return teamIndexedScore + $scope.play.teamPointsAssigned;

                }, function(teamIndexedScore) {

                    $scope.play.teamIndexedScore = teamIndexedScore;
                });

                /* Watch the opposing team score in the previous play. */
                $scope.$watch(function() {

                    var playIndex = $scope.plays.indexOf($scope.play);
                    var previousPlay = $scope.plays[playIndex - 1];

                    if (!previousPlay) return 0;

                    var opposingIndexedScore = previousPlay.opposingIndexedScore || 0;

                    return opposingIndexedScore + $scope.play.opposingPointsAssigned;

                }, function(opposingIndexedScore) {

                    $scope.play.opposingIndexedScore = opposingIndexedScore;
                });
            }

            if (angular.isDefined($scope.filteredPlaysIds)) {
                $scope.$watchCollection('filteredPlaysIds', function(newFilteredPlaysIds, oldFilteredPlaysIds) {
                    // Filter the play if it's in the updated filteredPlaysIds
                    if (newFilteredPlaysIds !== oldFilteredPlaysIds) {
                        if (newFilteredPlaysIds.indexOf($scope.play.id) !== -1) {
                            $scope.play.isFiltered = true;
                        } else {
                            $scope.play.isFiltered = false;
                        }
                    }
                });
            }

            $scope.deleteReelPlay = function(index) {
                $scope.$emit('delete-reel-play', index);
            };

            element.on('$destroy', onDestroy);

            var removeCurrentPlayWatch = $scope.$watch('playManager.current', currentPlayWatch);

            /* If the play has a clip. */
            /* Listen for video player "clip-completion" events. */
            if ($scope.play.clip) emitter.subscribe(EVENT_MAP['clip-completion'], clipCompletionHandler);

            function currentPlayWatch(currentPlay) {

                if ($scope.play === currentPlay) {
                    emitter.subscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
                }

                else {

                    emitter.unsubscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
                }
            }

            function timeUpdateHandler(e) {

                /* Get the video time. */
                var videoTime = e.detail.time;

                /* Push events to the mediator. */
                function pushToMediator(event) {

                    var eventTime = event.time - $scope.play.startTime;

                    /* If video time has not passed the event time. */
                    if (videoTime <= eventTime) {

                        /* Push the event to the mediator. */
                        currentEventMediator.push(event);
                    }
                }

                /* Add events to the current event mediator. */
                $scope.play.events.forEach(pushToMediator);

                /* Flush the current event mediator to find the current event. */
                currentEventMediator.flush();
            }

            function clipCompletionHandler() {

                /* If continuous play is on and if the start time of this play
                 * is greater than the end time of the current play. */
                if (playManager.playAllPlays &&
                    $scope.play.clip &&
                    $scope.play.hasVisibleEvents &&
                    $scope.play.isFiltered &&
                    $scope.play.startTime > playManager.current.endTime) {

                    /* Put play into pool of plays that should be played next. */
                    playVideoMediator.push($scope.play);
                }
            }

            function onDestroy() {

                removeCurrentPlayWatch();
                emitter.unsubscribe(EVENT_MAP['timeupdate'], timeUpdateHandler);
                emitter.unsubscribe(EVENT_MAP['clip-completion'], clipCompletionHandler);
            }
        }

        return Play;
    }
]);

/**
 * Play controller.
 * @module Play
 * @name Play.controller
 * @type {controller}
 */
//TODO far too much DI -- remove some
Play.controller('Play.controller', [
    '$scope', '$state', '$stateParams', '$modal', '$interval', 'ROLES', 'SessionService', 'config', 'TeamsFactory', 'PlayManager', 'IndexingService', 'EventManager', 'VideoPlayer', 'VG_STATES', 'VIEWPORTS', 'GamesFactory',
    function controller($scope, $state, $stateParams, $modal, $interval, ROLES, session, config, teams, playManager, indexing, eventManager, videoPlayer, VG_STATES, VIEWPORTS, games) {

        var currentUser = session.currentUser;

        $scope.VIEWPORTS = VIEWPORTS;
        $scope.game = games.get($scope.play.gameId);

        $scope.isIndexer = currentUser.is(ROLES.INDEXER);
        $scope.isAthlete = currentUser.is(ROLES.ATHLETE);
        $scope.isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;

        $scope.playIsInBreakdown = $state.current.name === 'Games.Breakdown';

        $scope.playManager = playManager;

        $scope.videoPlayer = videoPlayer;
        $scope.VG_STATES = VG_STATES;

        /* Indicates if the play has visible events; set by the events. */
        $scope.play.hasVisibleEvents = false;

        /* Current play summary; filled in by the events. */
        $scope.play.summary = { priority: 0 };

        /* All of the play summaries; filled in by the events. */
        $scope.play.summaries = [];

        /* Play possesion; filled in by the events. */
        $scope.play.possessionTeamId = null;

        $scope.playPlayed = false;

        $scope.reelsActive = config.reels.turnedOn;

        /**
         * Selects this play.
         */
        $scope.selectPlay = function() {

            var play = $scope.play;
            var event = eventManager.current || play.events[0];

            /* If the video player is ready. */
            if (videoPlayer.isReady) {

                /* Use the current event time for the video time. */
                var time = event.time;

                /* If the play has been clipped. */
                if (play.clip) {

                    /* Adjust the video time to start time of the play. */
                    time -= play.startTime;

                    /* Get the video sources for the play. */
                    var sources = play.getVideoSources();

                    /* If the play has changed. */
                    if (playManager.current !== play) {

                        /* Change the video player sources. */
                        videoPlayer.changeSource(sources);
                    }
                }

                /* Seek the video player to the appropriate time. */
                videoPlayer.seekTime(time);
            }

            /* Set the current play to match the selected play. */
            playManager.current = play;
        };

        $scope.selectMobileClipPlay = function() {
            $scope.selectPlay();
            if ($state.current.name === 'Clips') {
                $scope.playPlay();
            } else if ($state.current.name === 'ReelsArea') {
                $state.go('Clips', {id: $scope.play.id, reel: $stateParams.id, game: null});
            } else if ($state.current.name.indexOf('Games') > -1) { // Checks for all states with 'Games' in state name string
                $state.go('Clips', {id: $scope.play.id, game: $stateParams.id, reel: null});
            } else {
                $state.go('Clips', {id: $scope.play.id});
            }
        };

        /**
         * Deletes this play.
         */
        $scope.deletePlay = function() {

            $modal.open({

                controller: 'Indexing.Modal.DeletePlay.Controller',
                templateUrl: 'indexing/modal-delete-play.html'

            }).result.then(function() {

                indexing.showTags = true;
                indexing.showScript = false;
                indexing.eventSelected = false;
                indexing.isIndexing = false;
            });
        };
    }
]);
