/* Component resources */
const template = require('./template.html');
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ProfileOnboarding page module.
 * @module ProfileOnboarding
 */
const ProfileOnboarding = angular.module('ProfileOnboarding', [
    'ui.bootstrap'
]);

/* Cache the template file */
ProfileOnboarding.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('profile-onboarding.html', template);
    }
]);

/**
 * ProfileOnboarding Modal
 * @module ProfileOnboarding
 * @name ProfileOnboarding.Modal
 * @type {service}
 */
ProfileOnboarding.value('ProfileOnboarding.ModalOptions', {

    templateUrl: 'profile-onboarding.html',
    controller: 'ProfileOnboarding.controller',
    size: 'md'
});


/**
 * ProfileOnboarding modal dialog.
 * @module ProfileOnboarding
 * @name ProfileOnboarding.Modal
 * @type {service}
 */
ProfileOnboarding.service('ProfileOnboarding.Modal',[
    '$modal', 'ProfileOnboarding.ModalOptions',
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
 * ProfileOnboarding controller.
 * @module ProfileOnboarding
 * @name ProfileOnboarding.controller
 * @type {controller}
 */
ProfileOnboarding.controller('ProfileOnboarding.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    'Utilities',
    'TeamsFactory',
    'SportsFactory',
    'LeaguesFactory',
    'PositionsetsFactory',
    'SessionService',
    'ROLE_TYPE',
    function controller(
        $scope,
        $state,
        $modalInstance,
        utilities,
        teams,
        sports,
        leagues,
        positionsets,
        session,
        ROLE_TYPE
    ) {
        $scope.currentUser = session.getCurrentUser();
        $scope.teams = [];

        $scope.currentUser.roles.forEach(role => {
            if (role.type === ROLE_TYPE.ATHLETE) {
                $scope.teams.push(teams.get(role.teamId));
            }
        });
        console.log($scope.teams);
    }
]);
