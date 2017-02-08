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
    'BasicModals',
    'SessionService'
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
    modals,
    session
) {

    $scope.ROLES = ROLES;
    $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;
    $scope.team = ($scope.role && $scope.role.teamId)? teams.get($scope.role.teamId) : null;
    $scope.school = ($scope.team && $scope.team.schoolId) ? schools.get($scope.team.schoolId) : null;
    let currentUser = session.getCurrentUser();

    $scope.getFilmExchanges = function(){
        filmExchanges.getAllConferences({count: 1000}).then(
            function(data){
                $scope.filmExchanges = data;
                $scope.getFilmExchangePrivileges();
            }
        );
    };

    $scope.getFilmExchangePrivileges = function(){
        if($scope.role.id){
            users.getFilmExchangePrivileges($scope.user.id, true).then(
                function(data){
                    $scope.privileges = data;

                    let filmExchangesMap = $scope.filmExchanges.map(function(e) { return e.name; });

                    for(let p of $scope.privileges){
                        let index = filmExchangesMap.indexOf(p.filmExchangeName);
                        $scope.filmExchanges.splice(index,1);
                        filmExchangesMap.splice(index,1);
                    }
                }
            );
        }
    };

    if ($scope.user.is($scope.role, ROLES.FILM_EXCHANGE_ADMIN)) {
        $scope.getFilmExchanges();
    }

    if ($scope.user.is($scope.role, ROLES.INDEXER)) {
        $scope.noQA = ($scope.role.indexerQuality == 1) ? null : true;
    }

    $scope.newFilmExchangePrivilege = function(){
            $scope.newPrivilege = {
                roleId: $scope.role.id
            };
    };

    // TODO: Add error cases if serve response fails
    $scope.addNewFilmExchangePrivilege = function(){

        users.addFilmExchangePrivilege($scope.user.id, $scope.newPrivilege).then(
            function() {
                alerts.add({
                    type: 'success',
                    message: 'Changes Saved!'
                });

                $scope.newPrivilege = null;
                $scope.selectedExchange = null;
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
            users.deleteFilmExchangePrivilege($scope.user.id, privilege.id).then(
                function() {
                    alerts.add({
                        type: 'success',
                        message: 'Changes Saved!'
                    });

                    // Since film exchanges which are already on the role are removed from the film exchange list this line
                    // adds the film exchange back to the array. Note however that it will now only have the properties
                    // used for a privilege - not the full list of properties other film exchanges have. This is done
                    // to save a repeat call to fetch film exchanges.
                    $scope.filmExchanges.unshift(privilege);
                    $scope.getFilmExchanges();
                }
            );
        });
    };

    $scope.cancelFilmExchangePrivilege = function(){
            $scope.newPrivilege = null;
            $scope.selectedExchange = null;
    };

    $scope.onSelectFilmExchange = function(exchange){
        $scope.newPrivilege.sportsAssociation = exchange.sportsAssociation;
        $scope.newPrivilege.gender = exchange.gender;
        $scope.newPrivilege.conference = exchange.conference;
        $scope.newPrivilege.sportId = exchange.sportId;
    };

    $scope.saveQA = function() {
        $scope.role.indexerQuality = $scope.noQA ? 0 : 1;
        $scope.saveUser();
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
