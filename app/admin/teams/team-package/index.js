/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team Package page module.
 * @module Team Package
 */
var TeamPackage = angular.module('team-package', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamPackage.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('app/admin/teams/team-package/team-package.html', template);
    }
]);

/**
 * Team Package controller.
 * @module Team Package
 * @name TeamPackageController
 * @type {Controller}
 */
TeamPackage.controller('TeamPackageController', [
    '$scope', '$state', '$modalInstance', 'SessionService',
    function controller($scope, $state, $modalInstance, session) {
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);

