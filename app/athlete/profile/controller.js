/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile page module.
 * @module Profile
 */
var Profile = angular.module('Athlete.Profile');

/**
 * Profile controller.
 * @module Profile
 * @name Profile.controller
 * @type {controller}
 */
Profile.controller('Athlete.Profile.controller', [
    '$scope', '$state',
    function controller($scope, $state) {
        $state.go('Athlete.Profile.Highlights');

        $scope.athlete = {
            name: 'Alex Young',
            height: 68,
            weight: '150',
            position: 'Quarterback (QB)',
            school: 'Laguna Beach High School',
            graduationYear: '2010',
            profilePicture: 'http://cocopebble.com/wp-content/uploads/2013/06/krossover-symbol-white-bg.jpg'
        };

        $scope.buttonText = 'Test Button';

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

        $scope.toInt = function toInt(num) {
            return Math.floor(num);
        };
    }
]);
