NewRoleController.$inject = [
    '$scope',
    '$element',
    'UsersFactory',
    'TeamsFactory',
    'SportsFactory',
    'AlertsService',
    'INDEXER_GROUPS_ID',
    'ROLES',
    'ROLE_TYPE'
];

function NewRoleController (
    $scope,
    $element,
    users,
    teams,
    sports,
    alerts,
    INDEXER_GROUPS_ID,
    ROLES,
    ROLE_TYPE
) {
    $scope.ROLES = ROLES;
    $scope.INDEXER = ROLES.INDEXER;
    $scope.HEAD_COACH = ROLES.HEAD_COACH;
    $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
    $scope.ATHLETE = ROLES.ATHLETE;
    $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;

    // Convert the INDEXER_GROUPS_ID object into a ng-options useable array of objects
    $scope.indexerGroupOptions = [];
    angular.forEach(INDEXER_GROUPS_ID, function parseIndexerGroupId(indexerGroupName, indexerGroupId) {
        $scope.indexerGroupOptions.push({ id: parseInt(indexerGroupId, 10), name: indexerGroupName });
    });

    $scope.user.roles = $scope.user.roles || [];

    $scope.users = users;
    $scope.sportsList = sports.getList();

    $scope.addRole = function(newRole) {

        let team = newRole.teamId ? teams.get(newRole.teamId): null;

        /* Add role to the user roles array. */
        // TODO: Pass in teamId directly rather than getting off the newRole
        let oldRoles = angular.copy($scope.user.roles);
        $scope.user.addRole(newRole, team);
        $scope.saveOrRevertRoles(oldRoles);
        $scope.newRoles.splice($scope.newRoles.indexOf(newRole), 1);
        $element.remove();
    };

    $scope.removeRole = (newRole) => {
        $scope.newRoles.splice($scope.newRoles.indexOf(newRole), 1);
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


}

export default NewRoleController;
