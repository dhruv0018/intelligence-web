/* Fetch angular from the browser scope */
const angular = window.angular;

import EmbedDataDependencies from './data.js';
import EmbedController from './controller.js';

/**
 * Embed module.
 * @module Embed
 */
const Embed = angular.module('Embed', [
    'ui.router',
    'ui.bootstrap'
]);

Embed.factory('EmbedDataDependencies', EmbedDataDependencies);

/**
 * Embed state router.
 * @module Embed
 * @type {UI-Router}
 */
Embed.config([
    '$stateProvider',
    function config ($stateProvider) {

        const shortEmbedState = {
            name: 'ShortEmbed',
            url: '/e/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function onEnterShortEmbedState ($state, $stateParams) {

                    let reelId = parseInt($stateParams.id, 36);

                    $state.go('Embed', {id: reelId});
                }
            ]
        };

        const embedRestricted = {
            name: 'Embed.Restricted',
            url: 'embed/',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'app/embed/restricted.html'
                }
            }
        };

        const embedDeleted = {
            name: 'Embed.Deleted',
            url: 'embed/',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'app/embed/deleted.html'
                }
            }
        };

        const embedState = {
            name: 'Embed',
            url: '/embed/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'app/embed/template.html',
                    controller: EmbedController
                }
            },
            resolve: {
                'Embed.Data': [
                    '$q', '$stateParams', 'EmbedDataDependencies',
                    function resolveEmbedState ($q, $stateParams, EmbedData) {

                        let reelId = Number($stateParams.id);
                        let data = new EmbedData(reelId);

                        return $q.all(data);
                    }
                ]
            },
            onEnter: [
                '$state', '$stateParams', 'ReelsFactory', 'SessionService',
                function onEnterEmbedState ($state, $stateParams, reels, session) {

                    let reelId = Number($stateParams.id);
                    let reel = reels.get(reelId);

                    if (reel.isDeleted) {

                        $state.go('Embed.Deleted');
                    }

                    /*Check if user has permissions to view reel*/
                    if (!reel.isAllowedToView()) {

                        $state.go('Embed.Restricted');
                    }

                }
            ],
            onExit: [
                'PlayManager',
                function onExitEmbedState (playManager) {

                    playManager.clear();
                }
            ]
        };

        $stateProvider.state(shortEmbedState);
        $stateProvider.state(embedRestricted);
        $stateProvider.state(embedDeleted);
        $stateProvider.state(embedState);
    }
]);

export default Embed;
