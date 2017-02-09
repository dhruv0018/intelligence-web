const angular = window.angular;
const ITEMSPERPAGE = 25;

FilmHomeGames.$inject = [
    '$q',
    '$stateParams',
    'config',
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
    $stateParams,
    config,
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
            let currentUser = session.getCurrentUser();
            let deferred = $q.defer();
            let start = ITEMSPERPAGE*($stateParams.page-1) || 0;
            let count = ITEMSPERPAGE;
            let gamesUrl = config.api.uri + 'games';
            usersFactory.load(currentUser.id).then(userResponse => {
                /* TODO: this is a temporary measure to ensure we get the games for the right role
                 * Update this when we can trust the roleId to be consistent
                 */
                let user = usersFactory.get(currentUser.id);
                let sessionCurrentRole = currentUser.getCurrentRole();
                let currentRole = user.roles.filter(role => {
                    if (role.teamId === sessionCurrentRole.teamId && role.type.id === sessionCurrentRole.type.id && !role.tenureEnd) {
                        return role;
                    }
                })[0];

                leaguesFactory.load().then(leagues => {
                    if(currentRole.type.id === ROLES.ATHLETE.type.id) {
                        let filter = {
                            athleteRelatedUserId: currentUser.id,
                            start,
                            count,
                            exclude: 'allTelestrations',
                            isDeleted: false,
                            sortBy: 'datePlayed',
                            sortOrder: 'desc'
                        };
                        let gamesPromise = gamesFactory.query(filter);
                        let gamesCount = gamesFactory.totalCount(filter, gamesUrl);
                        return $q.all([gamesPromise, gamesCount]).then(data => {
                            let gameData = {
                                data: data[0],
                                count: data[1]
                            };
                            deferred.resolve(gameData);
                        });
                    } else {
                        let filter = {
                            relatedRoleId: currentRole.id,
                            start,
                            count,
                            exclude: 'allTelestrations',
                            isDeleted: false,
                            sortBy: 'datePlayed',
                            sortOrder: 'desc'
                        };
                        let gamesPromise = gamesFactory.query(filter);
                        let gamesCount = gamesFactory.totalCount(filter, gamesUrl);
                        return $q.all([gamesPromise, gamesCount]).then(data => {
                            let gameData = {
                                data: data[0],
                                count: data[1],
                                roleId: currentRole.id
                            };
                            deferred.resolve(gameData);
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

        // Active Team Roster used for the Share modal
        get activePlayers() {
            let currentUser = session.getCurrentUser();
            let playersData = [];
            if(currentUser.is(ROLES.ATHLETE)){
                currentUser.roles.forEach(role=>{
                    if(role.teamId){
                        playersData.push(
                            teamsFactory.load(role.teamId)
                            .then(teams => playersFactory.load({rosterId: teams[0].roster.id, isActive: 1}))
                        );
                    }
                });
            }else{
                playersData.push(
                    teamsFactory.load(currentUser.getCurrentRole().teamId)
                        .then(teams => playersFactory.load({rosterId: teams[0].roster.id, isActive: 1}))
                );
            }
            return playersData;
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
    'SessionService',
    'ROLES'
];

export function FilmHomeReels (
    $q,
    users,
    reels,
    teams,
    players,
    session,
    ROLES
) {

    class FilmHomeReelsData {

        constructor () {
            let currentUser = session.getCurrentUser();
            let currentRoleId = currentUser.getCurrentRole().id;

            this.users = users.load({ relatedUserId: currentUser.id });
            this.reels = reels.load({ relatedUserId: currentUser.id });

            // Active Team Roster used for the Reel Share modal
            if(currentUser.is(ROLES.ATHLETE)){
                currentUser.roles.forEach(role=>{
                    if(role.teamId){
                        this['players_'+role.teamId] = teams.load(role.teamId)
                            .then(teams => players.load({rosterId: teams[0].roster.id, isActive: 1}));
                    }
                });
            }else{
                this.players = teams.load(currentUser.getCurrentRole().teamId)
                                    .then(teams => players.load({rosterId: teams[0].roster.id, isActive: 1}));
            }
        }
    }

    return FilmHomeReelsData;
}
