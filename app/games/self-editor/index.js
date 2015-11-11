/* Fetch angular from the browser scope */
const angular = window.angular;
const GamesSelfEditor = angular.module('Games.SelfEditor', []);

import GamesSelfEditorController from './controller.js';
import template from './template.html';

GamesSelfEditor.controller('Games.SelfEditor.controller', GamesSelfEditorController);

GamesSelfEditor.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const GamesSelfEditor = {
            name: 'Games.SelfEditor',
            url: '/self-editor',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    template,
                    controller: 'Games.SelfEditor.controller'
                }
            },
            resolve: {

                'Games.SelfEditor.Data': [
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

        $stateProvider.state(GamesSelfEditor);
    }
]);

GamesSelfEditor.service('Games.Data.Dependencies', [
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
                            teamId,
                            userId
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

export default GamesSelfEditor;
