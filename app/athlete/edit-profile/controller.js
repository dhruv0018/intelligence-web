/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Edit Profile page module.
 * @module Edit Profile
 */
var EditProfile = angular.module('Athlete.EditProfile');

/**
 * Edit Profile controller.
 * @module Edit Profile
 * @name EditProfile.controller
 * @type {controller}
 */
EditProfile.controller('Athlete.Profile.controller', [
    '$scope', '$state', 'SessionService',
    function controller($scope, $state, $session) {
        // TO-DO: Move this to somewhere more appropriate (state.onEnter?)
        $state.go('Athlete.EditProfile.BasicInfo');

        $scope.athlete = $session.currentUser;
        $scope.athlete.profilePicture = 'http://cocopebble.com/wp-content/uploads/2013/06/krossover-symbol-white-bg.jpg';

        $scope.tabs = {
            index: 0,
            length: 3,
            next: function next() {
                this.index = Math.min(this.index + 1, this.length - 1);
            },
            prev: function prev() {
                this.index = Math.max(this.index - 1, 0);
            }
        };
    }
]);
