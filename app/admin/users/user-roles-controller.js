const angular = window.angular;

UserRolesController.$inject = [
    '$scope',
    'UsersFactory',
    'AlertsService',
    'BasicModals',
    'ROLES'
];

/**
 * User roles controller. Controls the view for a users roles.
 * @module Users
 * @name User.Roles.Controller
 * @type {Controller}
 */
function UserRolesController(
    $scope,
    users,
    alerts,
    modals,
    ROLES
) {

    $scope.addNewRole = function (newRole) {
        if (!newRole) return;

        /* In the case of an Admin role, there is no information to fill in,
         * so add the role directly. */
        if (users.is(newRole, ROLES.ADMIN) || users.is(newRole, ROLES.FILM_EXCHANGE_ADMIN)) {
            let oldRoles = angular.copy($scope.user.roles);
            $scope.user.addRole(newRole);
            $scope.saveOrRevertRoles(oldRoles);
        /* For other roles; fill in information before adding. */
        } else {

            $scope.newRoles = $scope.newRoles || [];
            $scope.newRoles.unshift(angular.copy(newRole));
        }
        $scope.rolesChanged = true;
    };

    $scope.removeRole = function(role) {
        let removeRoleModal = modals.openForConfirm({
            title: 'Remove Role',
            bodyText: 'Are you sure you want to remove this role?',
            buttonText: 'Yes, Remove'
        });

        removeRoleModal.result.then(function removeRoleModalCallback() {
            let oldRoles = angular.copy($scope.user.roles);
            users.removeRole($scope.user, role);
            $scope.saveOrRevertRoles(oldRoles);
        });
    };

    // Takes a copy of the roles from before the local action was performed to revert to if it fails to save server side
    $scope.saveOrRevertRoles = function (backupCopy) {

        return $scope.user.save().then(function(resource) {

            // TO-DO: Improve the way save errors are handled. Currently the user factory doesn't take
            // success and error function callbacks and when I modified it to take them and pass them
            // on to baseSave, it ended up calling both the success and error callbacks on error so
            // I changed it back for the time being until we can look into this further.
            if(!resource) {
                alerts.add({
                    type: 'danger',
                    message: 'Save Unsuccessful'
                });

                $scope.user.roles = backupCopy;
            }
            else {
                users.load($scope.user.id).then(function(data){
                    $scope.$apply(function(){
                        $scope.user.roles = users.get($scope.user.id).roles;
                    });
                });

                alerts.add({
                    type: 'success',
                    message: 'Changes Saved!'
                });
            }
        });
    };

    $scope.ROLES = ROLES;
}

export default UserRolesController;
