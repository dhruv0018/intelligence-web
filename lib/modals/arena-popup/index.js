/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import ArenaPopupController from './controller';

/**
* ArenaPopup Module.
* @module ArenaPopup
*/

const ArenaPopup = angular.module('ArenaPopup', [
    'ui.router',
    'ui.bootstrap'
]);

/**
* ArenaPopup Modal
* @module ArenaPopup
* @name ArenaPopup.Modal
* @type {service}
*/
ArenaPopup.value('ArenaPopup.ModalOptions', {
    templateUrl: 'lib/modals/arena-popup/template.html',
    controller: ArenaPopupController,
    backdropClass: 'arenapopup-drop',
    windowClass: 'arenapopup-modal'
});

/**
* ArenaPopup modal dialog.
* @module ArenaPopup
* @name ArenaPopup.Modal
* @type {service}
*/
ArenaPopup.service('ArenaPopup.Modal',[
    '$modal',
    'ArenaPopup.ModalOptions',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'ARENA_TYPES',
    function(
        $modal,
        modalOptions,
        games,
        teams,
        leagues,
        ARENA_TYPES
    ) {

        const Modal = {

            open: function(field) {
                var resolves = {
                    resolve: {
                        field: function() { return field; }
                    }
                };
                const game = games.get(field.gameId);
                const team = teams.get(game.teamId);
                const league = leagues.get(team.leagueId);

                let arena_type = ARENA_TYPES[league.arenaId];
                console.log(arena_type);
                if(arena_type.type === "VOLLEYBALL"){
                    modalOptions.size = 'sm';
                }else{
                    modalOptions.size = 'lg';
                }
                var options = angular.extend(modalOptions, resolves);
                console.log('options', options, field);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

ArenaPopup.controller('ArenaPopup.Controller', ArenaPopupController);

export default ArenaPopup;
