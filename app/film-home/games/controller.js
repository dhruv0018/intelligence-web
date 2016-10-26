const angular = window.angular;

FilmHomeGamesController.$inject = [
    '$scope',
    '$filter',
    '$state',
    'UsersFactory',
    'GamesFactory',
    'TeamsFactory',
    'SchoolsFactory',
    'LeaguesFactory',
    'SessionService',
    'GameStatesService',
    'FilmHomeGames.Data',
    'ShareFilm.Modal',
    'STATE_NAMES',
    'ROLES',
    'GAME_TYPES',
    'SPORTS'
];

/**
 * Film Home Games page controller
 */
function FilmHomeGamesController(
    $scope,
    $filter,
    $state,
    usersFactory,
    gamesFactory,
    teamsFactory,
    schoolsFactory,
    leaguesFactory,
    session,
    gameStates,
    data,
    shareFilmModal,
    STATE_NAMES,
    ROLES,
    GAME_TYPES,
    SPORTS
) {
    let currentUser = session.getCurrentUser();
    $scope.currentUser = currentUser;
    $scope.ROLES = ROLES;
    $scope.STATE_NAMES = STATE_NAMES;
    $scope.teams = [];
    let gamesCopy = [];
    /* League and Season info for WSC highlights */
    if (currentUser.is(ROLES.COACH)) {
        /* Coach gets all games relevant to team unless it's a shared film with incomplete video */
        $scope.games = gamesFactory.getByRelatedRole().filter(game => {
            if (isShared(game)) {
                return game.video.isComplete();
            } else {
                return game;
            }
        });
        gamesCopy = angular.copy($scope.games);
        $scope.NoData = (gamesCopy.length == 0) ? true : false;
        let team = teamsFactory.get(session.getCurrentTeamId());
        let league = leaguesFactory.get(team.leagueId)||{};
        let season = league.getSeasonForWSC();
        let sport = team.getSport();
        //currently only 6 sports has thumbnail, TODO find more organize way to do
        if([1,2,3,4,5,8].indexOf(sport.id) > -1){
            $scope.sportName = sport.name.toLowerCase() || 'default';
        }else{
            $scope.sportName = 'default';
        }
        let isBrokenDownAllowed = sport.isBrokenDownAllowed();

        if (season) $scope.seasonId = season.id;
        $scope.leagueId = league.id;
        $scope.currentTeamIsBasketball = sport.id === SPORTS.BASKETBALL.id;
    } else if (currentUser.is(ROLES.ATHLETE)) {
        /* Athlete gets all games relevent to team with completed video */
        $scope.NoData = (data.games.length == 0) ? true : false;
        $scope.games = gamesFactory.getByRelatedRole().filter(game => {
            if (game.video) {
                return game.video.isComplete();
            }
        });
        gamesCopy = [];
        //For athlete the type of sport might be different
        $scope.games.forEach(game =>{
            if(game.teamId === null){
                game.sportName ='default';
            }else{
                let gameTeam = teamsFactory.get(game.teamId);
                let sportId = gameTeam.getSport().id || 0;
                //TODO take out the hardcode ids
                if([1,2,3,4,5,8].indexOf(sportId) > -1){
                    game.sportName = (gameTeam.getSport().name || 'default').toLowerCase();
                }else{
                    game.sportName = 'default';
                }
            }
            gamesCopy.push(game);
        });

        let athleteRoles = currentUser.getRoles(ROLES.ATHLETE.type.id);
        let teamIds = athleteRoles.map(role => role.teamId);
        $scope.teams = teamsFactory.getList(teamIds).filter(team => team.sportId === SPORTS.BASKETBALL.id);

        if ($scope.teams.length) {
            let selectedTeam = $scope.teams[0];
            let league = leaguesFactory.get(selectedTeam.leagueId);
            let season = league.getSeasonForWSC();
            $scope.leagueId = league.id;
            if (season) $scope.seasonId = season.id;
            $scope.currentTeamIsBasketball = $scope.teams.length > 0;
        }
    }

    $scope.filters = {'all': true};
    $scope.$on('applyFilter', function(event, data){
        $scope.filtering = true;
        $scope.filters = data;
        applyFilter();
    });

    //applyFilter function, you can call multiple places
    function applyFilter() {
        angular.forEach($scope.games, function(game, index) {
            let result = false;
            game.hide = true;
            if ($scope.filters['all']) {
                result = true;
            } else {
                if ($scope.filters['my'] && game.uploaderUserId === currentUser.id) {
                    result = true;
                }
                if ($scope.filters['scouting'] && game.gameType === GAME_TYPES.SCOUTING.id) {
                    result = true;
                }
                if ($scope.filters['conference'] && game.gameType === GAME_TYPES.CONFERENCE.id) {
                    result = true;
                }
                if ($scope.filters['breakdown'] && game.isDelivered()) {
                    let breakdownIsAvailable =
                        game.isSharedWithCurrentUser() ?
                        game.isBreakdownSharedWithCurrentUser() :
                        true;
                    if(breakdownIsAvailable){
                        result = true;
                    }
                }
                if ($scope.filters['shared'] && game.isSharedWithUser(currentUser)) {
                    result = true;
                }
                if ($scope.filters['selfEditor'] && game.isSelfEdited) {
                    if(!game.isSharedWithCurrentUser()){
                        result = true;
                    }
                }
            }
            if (result) {
                game.hide = false;
            }
            if(index == $scope.games.length -1 && $scope.filtering){
                $scope.filtering = false;
            }
        });
    }

    $scope.isNoResult = function() {
        if ($scope.games.length == 0 && gamesCopy.length > 0) {
            return true;
        } else {
            if ($scope.games.every(game => game.hide == true)) {
                return true;
            } else {
                return false;
            }
        }
    };

    $scope.search = function() {
        if ($scope.query.length >= 1) {
            $scope.games = gamesCopy.filter(function(game){
                let homeTeam = game.getHomeTeamName(game).toLowerCase();
                let awayTeam = game.getAwayTeamName(game).toLowerCase();
                let keywords = angular.copy($scope.query).toLowerCase();
                return (homeTeam.indexOf(keywords) > -1 || awayTeam.indexOf(keywords) > -1);
            });
            applyFilter();
        } else if ($scope.query.length === 0) {
            $scope.games = gamesCopy;
            applyFilter();
        }
    };

    $scope.showBreakdown = function(game) {
        if(game.video
            && game.isNotIndexed()
            && currentUser.is(ROLES.COACH)
            && isBrokenDownAllowed
            && !game.video.isFailed()
            && !isShared(game)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.isShared = isShared;
    function isShared(game) {
        return game.isSharedWithUser(currentUser) || game.isSharedWithTeamId(currentUser.currentRole.teamId);
    }

    $scope.goGamePage = function($event, gameState, game){
        $event.stopPropagation();
        $state.go(gameState, {id: game.id});
    };

    $scope.isShared = function(game) {
        let isUploader = game.uploaderUserId === currentUser.id;
        let isShared = (!isUploader &&
                (game.isSharedWithUser(currentUser) || game.isSharedWithTeamId(currentUser.currentRole.teamId)));

        return isShared;
    };

    $scope.getSharedByUserName = function(game) {
        let uploaderUser;
        if (isShared(game)) {
            if (game.isSharedWithUser(currentUser)) {
                uploaderUser = usersFactory.get(game.getShareByUser(currentUser).userId);
            } else if (game.isSharedWithTeamId(currentUser.currentRole.teamId)) {
                uploaderUser = usersFactory.get(game.getShareByTeamId(currentUser.currentRole.teamId).userId);
            }
        }

        return uploaderUser.name;
    };

    $scope.getCopiedFromTeamName = function(game) {
        if(game.copiedFromTeamId) {
            return teamsFactory.get(game.copiedFromTeamId).name;
        }
    };

    $scope.openShareModal = function($event, game) {
        $scope.bypassClickEvents($event);
        shareFilmModal.open(game, data.filmExchanges);
    };

    $scope.getGameStates = function(game) {
        if (!isShared(game)) {
            let gameStatesList = gameStates.get(game);
            gameStatesList = gameStatesList.map(state => {
                state.display = STATE_NAMES[state.name].display;
                return state;
            });
            return gameStatesList;
        }
    };

    $scope.hideStateForDropdown = function(state) {
        if (state.name === 'Games.Breakdown'
            || state.name === 'Games.Stats'
            || state.name === 'Games.Formations'
            || state.name === 'Games.ArenaChart') {
            return true;
        } else {
            return false;
        }
    };

    $scope.gameHasState = function(game, stateName) {
        return game.states.some(state => state.name === stateName);
    };

    $scope.selectState = function selectState(game, stateName, $event) {
        if ($event) $scope.bypassClickEvents($event);
        const stateParams = {
            id : game.id
        };
        $state.go(stateName, stateParams);
    };

    $scope.bypassClickEvents = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };
}

export default FilmHomeGamesController;
