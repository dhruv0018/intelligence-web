const angular = window.angular;

FilmHomeGames.$inject = [
    '$q',
    'UsersFactory',
    'GamesFactory',
    'TeamsFactory',
    'SchoolsFactory',
    'PlayersFactory',
    'LeaguesFactory',
    'SportsFactory',
    'SessionService',
    'ROLES'
];

export function FilmHomeGames (
    $q,
    usersFactory,
    gamesFactory,
    teamsFactory,
    schoolsFactory,
    playersFactory,
    leaguesFactory,
    sportsFactory,
    session,
    ROLES
) {

    var  FilmHomeGamesData = {

        get users(){
            let currentUser = session.getCurrentUser();
            return usersFactory.load({ relatedUserId: currentUser.id });
        },

        get games(){
            let currentUserId = session.getCurrentUserId();
            let deferred = $q.defer();
            usersFactory.load(currentUserId).then(userResponse => {
                let user = usersFactory.get(currentUserId);
                let currentRoleId = user.getCurrentRole().id;
                leaguesFactory.load().then(response =>{
                    if(user.is(ROLES.ATHLETE)){
                        return gamesFactory.load({ relatedUserId: currentUserId }).then(response =>{
                            deferred.resolve(gamesFactory.getByRelatedRole());
                        });
                    }else{
                        return gamesFactory.load({ relatedRoleId: currentRoleId }).then(response =>{
                            deferred.resolve(response);
                        });
                    }
                });
            });

            return deferred.promise;
        },

        get schools(){
            let currentUser = session.getCurrentUser();
            let deferred = $q.defer();
            teamsFactory.load({ relatedUserId: currentUser.id }).then(response =>{
                let teamsWithSchoolIds = response.filter(
                    team =>{
                        if(team.schoolId){
                            return team.schoolId;
                        }
                    }
                );
                let schoolIds = teamsWithSchoolIds.map(team => team.schoolId);
                schoolsFactory.load(schoolIds).then(response =>{
                    deferred.resolve(response);
                });
            });
            return deferred.promise;
        },

        get players(){
            let currentUser = session.getCurrentUser();
            if(currentUser.is(ROLES.ATHLETE)){
                return playersFactory.load({ userId: currentUser.id });
            }else{
                return [];
            }
        },

        get filmExchanges(){
            let currentUser = session.getCurrentUser();
            return teamsFactory.getFilmExchanges(currentUser.getCurrentRole().teamId);
        }

    };

    return FilmHomeGamesData;
}


FilmHomeReels.$inject = [
    '$q',
    'UsersFactory',
    'ReelsFactory',
    'TeamsFactory',
    'PlayersFactory',
    'SessionService'
];

export function FilmHomeReels (
    $q,
    users,
    reels,
    teams,
    players,
    session
) {

    class FilmHomeReelsData {

        constructor () {
            let currentUser = session.getCurrentUser();
            let currentRoleId = currentUser.getCurrentRole().id;

            this.users = users.load({ relatedUserId: currentUser.id });
            this.reels = reels.load({ relatedUserId: currentUser.id });

            this.players = teams.load(currentUser.getCurrentRole().teamId).then(teams=>{
                return players.load({ rosterId: teams[0].roster.id });
            });

        }
    }

    return FilmHomeReelsData;
}
