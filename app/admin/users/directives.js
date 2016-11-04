/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * New role directive.
 * @module Users
 * @name NewRole
 * @type {Directive}
 */
Users.directive('krossoverNewRole', [
    'ROLES', 'ROLE_TYPE', 'UsersFactory', 'TeamsFactory', 'SchoolsFactory', 'SportsFactory', 'INDEXER_GROUPS_ID', 'AlertsService', '$q',
    function directive(ROLES, ROLE_TYPE, users, teams, schools, sports, INDEXER_GROUPS_ID, alerts, $q) {

        var role = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {

                user: '=',
                role: '=',
                newRoles: '='
            },

            templateUrl: 'users/newrole.html',

            link: function($scope, element, attributes) {

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
                $scope.loading = false;

                $scope.addRole = function(newRole) {
                    $scope.loading = true;

                    function addNewRole (teamData = null) {
                        $scope.loading = false;

                        let team = teamData ? teamData[0] : null;
                        /* Add role to the user roles array. */
                        // TODO: Pass in teamId directly rather than getting off the newRole
                        let oldRoles = angular.copy($scope.user.roles);

                        $scope.user.addRole(newRole, team);
                        $scope.saveOrRevertRoles(oldRoles);
                        $scope.newRoles.splice($scope.newRoles.indexOf(newRole), 1);
                        element.remove();
                    }

                    if (newRole.teamId) {
                        teams.load(newRole.teamId).then(function (teamData) {
                            let team = teamData[0];

                            if (team.schoolId) {
                                schools.load(team.schoolId).then(function () {
                                    addNewRole(team);
                                });
                            }
                            else {
                                addNewRole(team);
                            }
                        });
                    }
                    else {
                        addNewRole();
                    }
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
        };

        return role;
    }
]);
