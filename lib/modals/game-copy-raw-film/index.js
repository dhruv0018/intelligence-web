const angular = window.angular;

import CopyRawFilmController from './controller';

/**
 * CopyGame page module.
 * @module CopyGame
 */
const CopyRawFilm = angular.module('CopyRawFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * CopyRawFilm Modal
 * @module CopyRawFilm
 * @name CopyRawFilm.Modal
 * @type {service}
 */
CopyRawFilm.value('CopyRawFilm.ModalOptions', {

    templateUrl: 'lib/modals/copy-raw-film/template.html',
    controller: CopyRawFilmController
});


/**
 * CopyRawFilm modal dialog.
 * @module CopyRawFilm
 * @name CopyRawFilm.Modal
 * @type {service}
 */
CopyRawFilm.service('CopyRawFilm.Modal',[
    '$modal', 'CopyRawFilm.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(parent) {

                var resolves = {

                    resolve: {

                        Parent: function() { return parent; }
                    }
                };
                //Used to prevent modal from closing on backdrop click
                modalOptions.backdrop = 'static';
                var options = angular.extend(modalOptions, resolves);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

CopyRawFilm.controller('CopyRawFilm.controller', CopyRawFilmController);

export default CopyRawFilm;
