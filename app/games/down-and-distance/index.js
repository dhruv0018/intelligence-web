/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesDownAndDistance = angular.module('Games.DownAndDistance', [
    'ui.multiselect'
]);

GamesDownAndDistance.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/downDistance.html', require('./template.html'));
    }
]);

GamesDownAndDistance.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var dnd = {
            name: 'Games.DownAndDistance',
            url: '/down-and-distance',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/downDistance.html',
                    controller: 'GamesDownAndDistance.controller'
                }
            },
            resolve: {
                'Games.DownAndDistance.Data': [
                    '$q', '$stateParams', 'UsersFactory', 'TeamsFactory', 'FiltersetsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'LeaguesFactory', 'TagsetsFactory',
                    function($q, $stateParams, users, teams, filtersets, games, players, plays, leagues, tagsets) {

                        var gameId = Number($stateParams.id);

                        let gamePromise = games.load(gameId);

                        let Data = {
                            game: gamePromise,
                            tagsets: tagsets.load(),
                            filtersets: filtersets.load()
                        };

                        gamePromise.then(function() {

                            let game = games.get(gameId);

                            let teamsPromise = teams.load([
                                game.uploaderTeamId,
                                game.teamId,
                                game.opposingTeamId
                            ]);

                            let Data = {
                                game: game,
                                user: users.load(game.uploaderUserId),
                                teams: teamsPromise,
                                plays: plays.load({
                                    gameId: game.id
                                }),
                                players: players.load({
                                    'rosterId[]': [
                                        game.getRoster(game.teamId).id,
                                        game.getRoster(game.opposingTeamId).id
                                    ]
                                })
                            };

                            Data.league = teamsPromise.then(function() {
                                let uploaderTeam = teams.get(game.uploaderTeamId);
                                return leagues.load(uploaderTeam.leagueId);
                            });

                            return $q.all(Data);
                        });

                        return $q.all(Data);
                    }
                ]
            }
        };

        $stateProvider.state(dnd);

    }
]);

GamesDownAndDistance.controller('GamesDownAndDistance.controller', [
    '$stateParams',
    '$scope',
    'TeamsFactory',
    'GamesFactory',
    'LeaguesFactory',
    'CustomtagsFactory',
    'PlaysFactory',
    'PlaylistEventEmitter',
    'ARENA_TYPES',
    'CUSTOM_TAGS_EVENTS',
    function controller(
        $stateParams,
        $scope,
        teams,
        games,
        leagues,
        customtags,
        plays,
        playlistEventEmitter,
        ARENA_TYPES,
        CUSTOM_TAGS_EVENTS
    ) {

        //Collections
        $scope.teams = teams.getMap();

        //Game Related
        var gameId = $stateParams.id;
        $scope.game = games.get(gameId);

        //Team Related
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        var team = teams.get($scope.teamId);

        var teamOnOffense = true;

        //League Related
        let league = leagues.get(team.leagueId);
        $scope.league = league;

        //Custom Tags Related
        $scope.customtags = customtags.getList();
        playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, event => {
            $scope.customtags = customtags.getList();
        });

        //Plays Related
        $scope.plays = plays.getList({ gameId: $scope.game.id });

        //Used to render the view for the
        $scope.options = {
            'distance': {
                'Any': undefined,
                'Short': 'short',
                'Medium': 'medium',
                'Long': 'long'
            },
            'weight': {
                'Any': undefined,
                'Left': 'Left',
                'Right': 'Right',
                'Balanced': 'Balanced'
            },
            'down': {
                'Any': undefined,
                '1st': '1st',
                '2nd': '2nd',
                '3rd': '3rd',
                '4th': '4th'
            },
            'hash': {
                'Any': undefined,
                'Left': 'Left',
                'Right': 'Right',
                'Middle': 'Middle'
            }
        };

        //Default Report request
        $scope.dndReport = {
            gameId: $scope.game.id,
            teamId: $scope.teamId,
            distance: $scope.options.distance[0],
            strength: $scope.options.weight[0],
            redZone: false,
            hash: $scope.options.hash[0],
            down: $scope.options.down[0],
            customTagIds: []
        };


        //Generates a down and distant report based on various properties stored on the dndReport object
        $scope.createDownAndDistanceReport = function() {
            $scope.creatingDnDReport = true;

            //TODO This casting seems very awkward -- perhaps the generation method should handle the casting
            if ($scope.dndReport.redZone === 'true') {
                $scope.dndReport.redZone = true;
                $scope.redzone = true;
            } else {
                $scope.dndReport.redZone = false;
                $scope.redzone = false;
            }

            //TODO this doesn't seem to be doing anything at all, it is basically setting the variable back to itself
            if ($scope.dndReport.teamId == $scope.teamId) {
                $scope.dndReport.teamId = $scope.teamId;
            } else if ($scope.dndReport.teamId == $scope.opposingTeamId) {
                $scope.dndReport.teamId = $scope.opposingTeamId;
            }

            games.getDownAndDistanceReport($scope.dndReport).then(function(dndReport) {
                $scope.game.dndReport = dndReport;
                $scope.chart = $scope.game.dndReport;
                $scope.createdDndReport = angular.copy($scope.dndReport);
                $scope.createdDndReport.customTags = customtags.getList($scope.createdDndReport.customTagIds);
                $scope.creatingDnDReport = false;
            });

        };

        // Determine arena type
        $scope.arenaType = ARENA_TYPES[league.arenaId].type;
    }
]);
