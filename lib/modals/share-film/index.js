const angular = window.angular;

import ShareFilmController from './controller';

/**
 * ShareFilm page module.
 * @module ShareFilm
 */
const ShareFilm = angular.module('ShareFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * ShareFilm modal dialog.
 * @module ShareFilm
 * @name ShareFilm.Modal
 * @type {value}
 */
ShareFilm.value('ShareFilm.ModalOptions', {

    templateUrl: 'lib/modals/share-film/template.html',
    controller: ShareFilmController,
    controllerAs: 'shareFilm'
});

/**
 * ShareFilm modal dialog.
 * @module ShareFilm
 * @name ShareFilm.Modal
 * @type {value}
 */
ShareFilm.service('ShareFilm.Modal', [
    '$modal', 'ShareFilm.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(film, filmExchanges) {

                var resolves = {

                    resolve: {

                        Film: function() { return film; },
                        FilmExchanges: function() { return filmExchanges; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

ShareFilm.controller('ShareFilm.controller', ShareFilmController);

export default ShareFilm;
