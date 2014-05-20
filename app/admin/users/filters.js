/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

Users.filter('EditableRolesByRole', [
    'ROLES', 'UsersFactory',
    function(ROLES, users) {

        return function(roles, role) {

            var filtered = [];

            if (!roles || !role) return filtered;

            angular.forEach(roles, function(filterRole) {

                /* Don't display group roles. */
                if (!Array.isArray(filterRole.type.id)) {

                    /* Add the role to the filtered list if the user has access. */
                    if (users.hasAccess(role, filterRole)) {

                        /* FIXME: Temporarily removing "Parent" role. */
                        if (!users.is(filterRole, ROLES.PARENT)) {

                            filtered.push(filterRole);
                        }
                    }
                }
            });

            return filtered;
        };
    }
]);

