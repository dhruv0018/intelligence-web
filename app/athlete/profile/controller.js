/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Profile page module.
 * @module Profile
 */
const Profile = angular.module('Athlete.Profile');

/**
 * Profile controller.
 * @module Profile
 * @name Profile.controller
 * @type {controller}
 */
Profile.controller('Athlete.Profile.controller', [
    '$scope', '$state', '$stateParams', 'UsersFactory',
    function controller($scope, $state, $stateParams, users) {
        // TO-DO: Move this to somewhere more appropriate (state.onEnter?)
        $state.go('Athlete.Profile.Highlights');

        $scope.athlete = users.get($stateParams.id);

        $scope.tabs = {
            index: 0,
            length: 4,
            next: function next() {
                this.index = Math.min(this.index + 1, this.length - 1);
            },
            prev: function prev() {
                this.index = Math.max(this.index - 1, 0);
            }
        };
    }
]);
