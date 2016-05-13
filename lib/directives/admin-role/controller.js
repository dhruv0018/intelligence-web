/**
* AdminRole.Controller dependencies
*/
AdminRoleController.$inject = [
    '$scope',
    'ROLES',
    'INDEXER_GROUPS_ID',
    'TeamsFactory',
    'SchoolsFactory',
    'FilmExchangeFactory',
    'UsersFactory',
    'AlertsService',
    'BasicModals'
];

/**
 * AdminRole.Controller
 * @module AdminRole
 * @name AdminRole.Controller
 * @type {Controller}
 */
function AdminRoleController (
    $scope,
    ROLES,
    INDEXER_GROUPS_ID,
    teams,
    schools,
    filmExchanges,
    users,
    alerts,
    modals
) {

    $scope.ROLES = ROLES;
    $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;
    $scope.team = ($scope.role && $scope.role.teamId)? teams.get($scope.role.teamId) : null;
    $scope.school = ($scope.team && $scope.team.schoolId) ? schools.get($scope.team.schoolId) : null;

    filmExchanges.getAllConferences().then(
        function(data){
            $scope.filmExchanges = data;
        }
    );

    $scope.getFilmExchangePrivileges = function(){
        if($scope.role.id){
            users.getFilmExchangePrivileges($scope.role.id).then(
                function(data){
                    $scope.privileges = data;
                }
            );
        }
    };

    $scope.getFilmExchangePrivileges();

    $scope.newFilmExchangePrivilege = function(){
            $scope.newPrivilege = {
                roleId: $scope.role.id
            };
    };

    // TODO: Add error cases if serve response fails
    $scope.addNewFilmExchangePrivilege = function(){
        users.addFilmExchangePrivilege($scope.role.id, $scope.newPrivilege).then(
            function() {
                alerts.add({
                    type: 'success',
                    message: 'Changes Saved!'
                });

                $scope.newPrivilege = null;
                $scope.getFilmExchangePrivileges();
            }
        );
    };

    $scope.deleteFilmExchangePrivilege = function(privilege){

        let removePrivilegeModal = modals.openForConfirm({
            title: 'Confirm Remove Film Exchange',
            bodyText: 'Are you sure you want to remove \'' + privilege.filmExchangeName + '\' from this role?',
            buttonText: 'Yes, Remove'
        });

        removePrivilegeModal.result.then(function removePrivilegeModalCallback() {
            users.deleteFilmExchangePrivilege($scope.role.id, privilege.id).then(
                function() {
                    alerts.add({
                        type: 'success',
                        message: 'Changes Saved!'
                    });

                    $scope.getFilmExchangePrivileges();
                }
            );
        });
    };

    $scope.cancelFilmExchangePrivilege = function(){
            $scope.newPrivilege = null;
    };

    $scope.onSelectFilmExchange = function(exchange){
        $scope.newPrivilege.sportsAssociation = exchange.sportsAssociation;
        $scope.newPrivilege.gender = exchange.gender;
        $scope.newPrivilege.conference = exchange.conference;
        $scope.newPrivilege.sportId = exchange.sportId;
    };

    $scope.saveUser = function () {

        $scope.user.save().then(function(resource) {
            if(!resource) {
                alerts.add({
                    type: 'danger',
                    message: 'Save Unsuccessful'
                });
            }
            else {
                alerts.add({
                    type: 'success',
                    message: 'Changes Saved!'
                });
            }
        });
    };
}

export default AdminRoleController;
