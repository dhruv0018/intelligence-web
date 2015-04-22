/* Fetch angular from the browser scope */
const angular = window.angular;

import ReelDataDependencies from './data.js';
import ReelController from './controller.js';

import template from './template.html.js';
import restricted from './restricted.html.js';

const templateUrl = './template.html';
const restrictedUrl = './restricted.html';
/**
 * Reel module.
 * @module Reel
 */
const Reel = angular.module('Reel', [
    'ui.router',
    'ui.bootstrap'
]);

Reel.factory('ReelDataDependencies', ReelDataDependencies);

/* Cache the template file */
Reel.run([
    '$templateCache',
    function run ($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put(restrictedUrl, restricted);
    }
]);

/**
 * Reel state router.
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

        const reelRestricted = {
            name: 'Reel.Restricted',
            url: 'reel/:id/restricted',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: './restricted.html'
                }
            }
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
                    '$q', '$stateParams', 'ReelDataDependencies',
                    function resolveReelState ($q, $stateParams, ReelData) {

                        let reelId = Number($stateParams.id);
                        let data = new ReelData(reelId);

                        return $q.all(data);
                    }
                ]
            },
            onEnter: [
                '$state', '$stateParams', 'AccountService', 'ReelsFactory', 'SessionService',
                function onEnterReelState ($state, $stateParams, account, reels, session) {

                    let currentUser = session.currentUser;
                    let reelId = Number($stateParams.id);
                    let reel = reels.get(reelId);

                    if (reel.isDeleted) {

                        account.gotoUsersHomeState();
                    }

                    if (!reel.isSharedWithPublic() && reel.uploaderTeamId !== currentUser.currentRole.teamId && !reel.isSharedWithUser(currentUser)) {
                        $state.go('Reel.Restricted', { id: reelId });
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
        $stateProvider.state(reelRestricted);
        $stateProvider.state(reelState);
    }
]);

export default Reel;
