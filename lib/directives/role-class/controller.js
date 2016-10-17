/* Fetch angular from the browser scope */
var angular = window.angular;

RoleClassController.$inject = [
    '$scope',
    'SessionService'
];

/**
 * RoleClass Controller
 * @module RoleClass
 * @name RoleClass
 * @type {Controller}
 */

function RoleClassController($scope, session) {

    $scope.session = session;

    this.formatClassName = function(roleName) {
        return roleName.replace(/\s/g, '-').toLowerCase() + '-role';
    };
}

export default RoleClassController;
