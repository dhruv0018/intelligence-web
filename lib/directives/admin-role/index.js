/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';
import AdminRoleDirective from './directive';
import AdminRoleController from './controller';

const templateUrl = 'admin-role/template.html';

/**
 * AdminRole
 * @module AdminRole
 */
const AdminRole = angular.module('AdminRole', []);

/* Cache the template file */
AdminRole.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

AdminRole.directive('adminRole', AdminRoleDirective);
AdminRole.controller('AdminRole.Controller', AdminRoleController);

export default AdminRole;
