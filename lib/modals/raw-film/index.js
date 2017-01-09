const angular = window.angular;

import RawFilmController from './controller';

/**
 * RawFilm page module.
 * @module RawFilm
 */
const RawFilm = angular.module('RawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * RawFilm modal dialog.
 * @module RawFilm
 * @name RawFilm.Modal
 * @type {value}
 */
RawFilm.value('RawFilm.ModalOptions', {

    templateUrl: 'lib/modals/raw-film/template.html',
    controller: RawFilmController,
    size: 'lg'
});

/**
 * RawFilm modal dialog.
 * @module RawFilm
 * @name RawFilm.Modal
 * @type {value}
 */
RawFilm.service('RawFilm.Modal', [
    '$uibModal', 'RawFilm.ModalOptions',
    function($uibModal, modalOptions) {

        var Modal = {

            open: function(game, removeGameFromFilmExchange, copyGameFromFilmExchange, trackEmailClick) {

                var resolves = {

                    resolve: {

                        Game: function() { return game; },
                        RemoveGameFromFilmExchange: function() { return removeGameFromFilmExchange; },
                        CopyGameFromFilmExchange: function() { return copyGameFromFilmExchange; },
                        TrackEmailClick: function() { return trackEmailClick; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

RawFilm.controller('RawFilm.controller', RawFilmController);

export default RawFilm;
