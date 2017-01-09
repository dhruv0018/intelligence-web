const angular = window.angular;

import CopyGameController from './controller';

/**
 * CopyGame page module.
 * @module CopyGame
 */
const CopyGame = angular.module('CopyGame', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * CopyGame Modal
 * @module CopyGame
 * @name CopyGame.Modal
 * @type {service}
 */
CopyGame.value('CopyGame.ModalOptions', {

    templateUrl: 'lib/modals/game-copy/template.html',
    controller: CopyGameController
});


/**
 * CopyGame modal dialog.
 * @module CopyGame
 * @name CopyGame.Modal
 * @type {service}
 */
CopyGame.service('CopyGame.Modal',[
    '$uibModal', 'CopyGame.ModalOptions',
    function($uibModal, modalOptions) {

        var Modal = {

            open: function(game) {
                const resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                const options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            },
            setScope: function(scope) {
                modalOptions.scope = scope;
            }
        };

        return Modal;
    }
]);

CopyGame.controller('CopyGame.controller', CopyGameController);

export default CopyGame;
