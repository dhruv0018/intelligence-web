/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AddProfileTeam page module.
 * @module AddProfileTeam
 */
const AddProfileTeam = angular.module('AddProfileTeam', [
    'ui.bootstrap'
]);

/* Cache the template file */
AddProfileTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-profile-team.html', template);
    }
]);

/**
 * AddProfileTeam Modal
 * @module AddProfileTeam
 * @name AddProfileTeam.Modal
 * @type {service}
 */
AddProfileTeam.value('AddProfileTeam.ModalOptions', {

    templateUrl: 'add-profile-team.html',
    controller: 'AddProfileTeam.controller',
    size: 'md'
});


/**
 * AddProfileTeam modal dialog.
 * @module AddProfileTeam
 * @name AddProfileTeam.Modal
 * @type {service}
 */
AddProfileTeam.service('AddProfileTeam.Modal',[
    '$modal', 'AddProfileTeam.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(options) {

                options = options || {};
                angular.extend(modalOptions, options);

                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

/**
 * AddProfileTeam controller.
 * @module AddProfileTeam
 * @name AddProfileTeam.controller
 * @type {controller}
 */
AddProfileTeam.controller('AddProfileTeam.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'Utilities',
    'GamesFactory',
    'ReelsFactory',
    'SessionService',
    function controller($scope,
        $state,
        $modalInstance,
        utilities,
        games,
        reels,
        session
    ) {

    }
]);
