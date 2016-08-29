const angular = window.angular;

HeaderDataDependencies.$inject = [
    '$q',
    'AuthenticationService',
    'SessionService',
    'SportsFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'UsersFactory',
    'SchoolsFactory',
    'ROLES'
];

function HeaderDataDependencies (
    $q,
    auth,
    session,
    sportsFactory,
    leaguesFactory,
    teamsFactory,
    usersFactory,
    schoolsFactory,
    ROLES
) {

    var HeaderData = {

        get sports() { return sportsFactory.load(); },
        get leagues() { return leaguesFactory.load(); },

        get school() {
            let teamId = session.getCurrentTeamId();

            if (teamId) {
                let deferred = $q.defer();

                teamsFactory.load(teamId).then(() => {
                    let team = teamsFactory.get(teamId);

                    if (team.schoolId) {
                        try {
                            schoolsFactory.load(team.schoolId).then(() => {
                                deferred.resolve();
                            });
                        }
                        catch(err) {
                            deferred.resolve();
                        }
                    } else {
                        deferred.resolve();
                    }


                });

                return deferred.promise;
            }
        },

        get userPermissions() {
            if (auth.isLoggedIn) {
                let currentUser = session.getCurrentUser();
                if (currentUser.is(ROLES.SUPER_ADMIN) || currentUser.is(ROLES.ADMIN)) {
                    let userPermissions = currentUser.getUserPermissions();
                    return userPermissions;
                }
            }
        },

        get teams() {

            if (auth.isLoggedIn) {

                let currentUser = session.getCurrentUser();
                let currentId = currentUser.id;

                // Only use relatedRoleId call for coaches - Athletes need relatedUserId to ensure all teams are loaded
                if(currentUser.is(ROLES.COACH)) {

                    let deferred = $q.defer();

                    // Load a fresh copy of the user to get the latest role ID
                    // TODO: Remove this once role IDs are locked down and user cache
                    //       problems with old, potentially changed role IDs are cleared
                    usersFactory.load(currentId).then(() => {
                        let role = usersFactory.get(currentId).getCurrentRole();

                        teamsFactory.load({ relatedRoleId: role.id }).then(function(){deferred.resolve();});
                    });

                    return deferred.promise;
                }
                else {
                    return teamsFactory.load({ relatedUserId: currentId });
                }

            }
        }
    };

    return HeaderData;
}

export default HeaderDataDependencies;
