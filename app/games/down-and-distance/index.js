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

        //Used to render the view for the dropdowns
        $scope.options = {
            'distance': [
                {
                    name: 'Any',
                    value: undefined
                },
                {
                    name: 'Short',
                    value: 'short'
                },
                {
                    name: 'Medium',
                    value: 'medium'
                },
                {
                    name: 'Long',
                    value: 'long'
                }
            ],
            'strength': [
                {
                    name: 'Any',
                    value: undefined
                },
                {
                    name: 'Left',
                    value: 'Left'
                },
                {
                    name: 'Right',
                    value: 'Right'
                },
                {
                    name: 'Balanced',
                    value: 'Balanced'
                }
            ],
            'down': [
                {
                    name: 'Any',
                    value: undefined
                },
                {
                    name: '1st',
                    value: '1st'
                },
                {
                    name: '2nd',
                    value: '2nd'
                },
                {
                    name: '3rd',
                    value: '3rd'
                },
                {
                    name: '4th',
                    value: '4th'
                }
            ],
            'hash': [
                {
                    name: 'Any',
                    value: undefined
                },
                {
                    name: 'Left',
                    value: 'Left'
                },
                {
                    name: 'Right',
                    value: 'Right'
                },
                {
                    name: 'Middle',
                    value: 'Middle'
                }
            ],
            'redZone': [
                {
                    name: 'Whole Field',
                    value: false
                },
                {
                    name: 'Redzone',
                    value: true
                }
            ]
        };

        //Default Report request
        $scope.dndReport = {
            gameId: $scope.game.id,
            teamId: $scope.teamId,
            distance: $scope.options.distance[0].value,
            strength: $scope.options.strength[0].value,
            redZone: $scope.options.redZone[0].value,
            hash: $scope.options.hash[0].value,
            down: $scope.options.down[0].value,
            customTagIds: []
        };

        //Generates a down and distant report based on various properties stored on the dndReport object
        $scope.createDownAndDistanceReport = function() {
            $scope.creatingDnDReport = true;

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
