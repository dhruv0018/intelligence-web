const angular = window.angular;

import FilmExchangeTeamsController from './controller';

/**
 * SelectIndexer page module.
 * @module SelectIndexer
 */
var FilmExchangeTeams = angular.module('FilmExchangeTeams', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * FilmExchange Modal
 * @module FilmExchange
 * @name FilmExchange.Modal
 * @type {service}
 */
FilmExchangeTeams.value('FilmExchangeTeams.ModalOptions', {

    templateUrl: 'lib/modals/film-exchange-teams/template.html',
    controller: FilmExchangeTeamsController
});


/**
 * FilmExchange modal dialog.
 * @module FilmExchange
 * @name FilmExchange.Modal
 * @type {service}
 */
FilmExchangeTeams.service('FilmExchangeTeams.Modal',[
    '$uibModal', 'FilmExchangeTeams.ModalOptions',
    function($uibModal, modalOptions) {

        var Modal = {

            open: function(id) {

                var resolves = {

                    resolve: {
                        exchangeId: function(){return id; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * FilmExchagne controller.
 * @module FilmExchagne
 * @name FilmExchagne.controller
 * @type {controller}
 */
FilmExchangeTeams.controller('FilmExchangeTeams.controller', FilmExchangeTeamsController);

export default FilmExchangeTeams;
