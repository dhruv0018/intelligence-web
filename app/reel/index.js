/* Fetch angular from the browser scope */
var angular = window.angular;

import ReelData from './data.js';
import ReelController from './controller.js';

import template from './template.html.js';

const templateUrl = 'reel/template.html';

/**
 * Reel Area page module.
 * @module Reel
 */
var Reel = angular.module('Reel', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Reel.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Reel page state router.
 * @module Reel
 * @type {UI-Router}
 */
Reel.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var shortReelState = {
            name: 'ShortReel',
            url: '/r/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var reelId = parseInt($stateParams.id, 36);
                    $state.go('Reel', {id: reelId});
                }
            ]
        };

        var reelsState = {
            name: 'Reel',
            url: '/reel/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'reel/template.html',
                    controller: ReelController
                }
            },
            resolve: {
                'Reel.Data': [
                    '$q', '$stateParams',
                    function dataService($q, $stateParams) {

                        let reelId = Number($stateParams.id);
                        let data = new ReelData(reelId);
                        console.log(data);
                        return $q.all(data);
                    }
                ]
            },
            onEnter: [
                '$state', '$stateParams', 'AccountService', 'ReelsFactory',
                function($state, $stateParams, account, reels) {

                    var reelId = Number($stateParams.id);
                    var reel = reels.get(reelId);

                    if (reel.isDeleted) {
                        account.gotoUsersHomeState();
                    }
                }
            ],
            onExit: [
                'PlayManager',
                function(playManager) {
                    playManager.clear();
                }
            ]
        };

        $stateProvider.state(shortReelState);
        $stateProvider.state(reelsState);
    }
]);

export default Reel;
