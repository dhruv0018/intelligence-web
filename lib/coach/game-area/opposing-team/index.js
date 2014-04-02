/* Component settings */
var templateUrl = 'coach/uploading-film/opposing-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Opposing Team page module.
 * @module OpposingTeam
 */
var OpposingTeam = angular.module('opposing-team', []);

/* Cache the template file */
OpposingTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Opposing Team page state router.
 * @module OpposingTeam
 * @type {UI-Router}
 */
OpposingTeam.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('opposing-team', {
                url: '',
                parent: 'uploading-film',
                views: {
                    'opposing-team@uploading-film': {
                        templateUrl: templateUrl,
                        controller: 'OpposingTeamController'
                    }
                }
            });
    }
]);

/**
 * OpposingTeam controller.
 * @module OpposingTeam
 * @name OpposingTeamController
 * @type {Controller}
 */
OpposingTeam.controller('OpposingTeamController', [
    'config', '$rootScope', '$scope', '$state', '$localStorage', '$http', 'GameAreaTabs', 'GamesFactory', 'PlayersFactory',
    function controller(config, $rootScope, $scope, $state, $localStorage, $http, tabs, games, players) {

        /**
         * Load local storage.
         */

        $scope.$storage = $localStorage;

        $scope.$storage.opposingTeam.players = $scope.$storage.opposingTeam.players || [];

        $scope.$storage.opposingTeam.roster = $scope.$storage.opposingTeam.roster ||
                                              $scope.$storage.game.getRoster($scope.$storage.game.opposingTeamId);

        /*
         * Setup scope.
         */

        $scope.rosterId = $scope.$storage.opposingTeam.roster.id;

        /*
         * Scope watches.
         */

        $scope.$watch('formOpposingTeam.$invalid', function(invalid) {

            tabs.instructions.disabled = invalid;
        });

        /*
         * Scope methods.
         */

        $scope.addNewPlayer = function() {

            var player = {

                played: true,
                jerseyNumbers: {}
            };

            $scope.$storage.opposingTeam.players.push(player);
        };

        $scope.removePlayer = function(player) {

            if (player) $scope.$storage.opposingTeam.players.splice($scope.$storage.opposingTeam.players.indexOf(player), 1);
        };

        $scope.uploadPlayers = function(files) {

            var file = files[0];
            var data = new FormData();

            data.append('rosterId', $scope.rosterId);
            data.append('roster', file);

            $http.post(config.api.uri + 'batch/players/file',

                data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })

                .success(function(data) {

                    $scope.$storage.opposingTeam.players = data.map(function(player) {

                        player.name = player.firstName + ' ' + player.lastName;
                        player.played = true;
                        return player;
                    });
                })

                .error(function() {

                    $rootScope.$broadcast('alert', {

                        type: 'danger',
                        message: 'There was a problem. Please try again.'
                    });
                });
        };

        $scope.save = function() {

            players.save($scope.rosterId, $scope.$storage.opposingTeam.players);
            tabs['opposing-team'].active = false;
            tabs.instructions.active = true;
            $state.go('instructions');
        };
    }
]);

