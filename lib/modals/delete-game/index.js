const angular = window.angular;

import DeleteGameController from './controller';

/**
 * DeleteGame page module.
 * @module DeleteGame
 */
const DeleteGame = angular.module('DeleteGame', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * DeleteGame Modal
 * @module DeleteGame
 * @name DeleteGame.Modal
 * @type {service}
 */
DeleteGame.value('DeleteGame.ModalOptions', {

    templateUrl: 'lib/modals/delete-game/template.html',
    controller: DeleteGameController
});


/**
 * DeleteGame modal dialog.
 * @module DeleteGame
 * @name DeleteGame.Modal
 * @type {service}
 */
DeleteGame.service('DeleteGame.Modal',[
    '$uibModal', 'DeleteGame.ModalOptions', 'SessionService', 'ROLES',
    function($uibModal, modalOptions, session, ROLES) {

        const Modal = {

            open: function(game) {
                var resolves = {

                    resolve: {

                        Game: function() { return game; },
                        FilmExchanges: function() {
                            // If a coach, get any film exchanges this game is shared with
                            if (session.getCurrentUser().is(ROLES.COACH)) {
                                let excludeCopiedGames = 1;
                                return game.getFilmExchanges(game.id, excludeCopiedGames).then(filmExchanges => {
                                    return filmExchanges;
                                });
                            }
                        }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            },
            setScope: function(scope) {
                modalOptions.scope = scope;
            }
        };

        return Modal;
    }
]);

DeleteGame.controller('DeleteGame.controller', DeleteGameController);

export default DeleteGame;
