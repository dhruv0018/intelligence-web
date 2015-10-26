/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Module Imports */
import AdminRoleController from './controller';

const templateUrl = 'admin-role/template.html';

/**
* AdminRoleDirective dependencies
*/
AdminRoleDirective.$inject = [];

/**
 * AdminRole Directive
 * @module AdminRole
 * @name AdminRole
 * @type {directive}
 */
function AdminRoleDirective (
) {

    const definition = {

        restrict: TO += ELEMENT,

        templateUrl: templateUrl,

        scope: {

                user: '=',
                role: '='
        },

        controller: AdminRoleController,
    };

    return definition;
}

export default AdminRoleDirective;
