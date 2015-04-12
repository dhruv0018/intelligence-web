/* Fetch angular from the browser scope */
const angular = window.angular;

import ReelData from './data.js';
import ReelController from './controller.js';

import template from './template.html.js';

const templateUrl = 'reel/template.html';

/**
 * Reel Area page module.
 * @module Reel
 */
const Reel = angular.module('Reel', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Reel.run([
    '$templateCache',
    function run ($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Reel page state router.
 * @module Reel
 * @type {UI-Router}
 */
Reel.config([
    '$stateProvider',
    function config ($stateProvider) {

        const shortReelState = {
            name: 'ShortReel',
            url: '/r/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function onEnterShortReelState ($state, $stateParams) {

                    let reelId = parseInt($stateParams.id, 36);

                    $state.go('Reel', {id: reelId});
                }
            ]
        };

        const reelState = {
            name: 'Reel',
            url: '/reel/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl,
                    controller: ReelController
                }
            },
            resolve: {
                'Reel.Data': [
                    '$q', '$stateParams',
                    function resolveReelState ($q, $stateParams) {

                        let reelId = Number($stateParams.id);
                        let data = new ReelData(reelId);

                        return $q.all(data);
                    }
                ]
            },
            onEnter: [
                '$state', '$stateParams', 'AccountService', 'ReelsFactory',
                function onEnterReelState ($state, $stateParams, account, reels) {

                    var reelId = Number($stateParams.id);
                    var reel = reels.get(reelId);

                    if (reel.isDeleted) {

                        account.gotoUsersHomeState();
                    }
                }
            ],
            onExit: [
                'PlayManager',
                function onExitReelState (playManager) {

                    playManager.clear();
                }
            ]
        };

        $stateProvider.state(shortReelState);
        $stateProvider.state(reelState);
    }
]);

export default Reel;
