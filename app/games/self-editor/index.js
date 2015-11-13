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
            }
        };

        $stateProvider.state(GamesSelfEditor);
    }
]);

export default GamesSelfEditor;
