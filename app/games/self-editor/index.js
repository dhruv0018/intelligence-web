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
                    '$stateParams', '$q', 'SelfEditedPlaysFactory', 'UsersFactory', 'Utilities',
                    function($stateParams, $q, selfEditedPlaysFactory, usersFactory, utilities) {
                        let gameId = Number($stateParams.id);

                        return selfEditedPlaysFactory.load({gameId}).then(function(selfEditedPlays){
                            let Data = {};
                            let userIds = selfEditedPlays.map(selfEditedPlay => selfEditedPlay.createdByUserId);
                            userIds = utilities.unique(userIds);
                            if (userIds.length) Data.users = usersFactory.load(userIds);
                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(GamesSelfEditor);
    }
]);

export default GamesSelfEditor;
