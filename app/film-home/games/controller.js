const angular = window.angular;
const ITEMSPERPAGE = 25;

FilmHomeGamesController.$inject = [
    '$q',
    '$scope',
    '$filter',
    '$state',
    '$stateParams',
    'config',
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
    'GAME_STATUSES',
    'GAME_TYPES',
    'SPORTS'
];

/**
 * Film Home Games page controller
 */
function FilmHomeGamesController(
    $q,
    $scope,
    $filter,
    $state,
    $stateParams,
    config,
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
    GAME_STATUSES,
    GAME_TYPES,
    SPORTS
) {

    let currentUser = session.getCurrentUser();
    $scope.currentUser = currentUser;
    $scope.ROLES = ROLES;
    $scope.STATE_NAMES = STATE_NAMES;
    $scope.teams = [];
    let gamesCopy = [];
    $scope.games = data.games.data;
    $scope.gamesTotalCount = data.games.count;
    $scope.itemsPerPage = ITEMSPERPAGE;
    $scope.isFiltered = false;
    let timeout = null;

    if (currentUser.is(ROLES.COACH)) {
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

        if (!$scope.NoData) {
            let currentPage = $stateParams.page||1;
            $scope.page = {
                currentPage
            };
        }
    } else if (currentUser.is(ROLES.ATHLETE)) {
        /* Athlete gets all games relevent to team with completed video */
        $scope.NoData = (data.games.length == 0) ? true : false;
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
        $scope.page.currentPage = 1; // Revert back to first page when filtering
        let start = 0;
        applyFilter(start);
    });

    // Query the games endpoint with an updated filter
    function applyFilter(start) {
        let filter = {start};

        if ($scope.query && $scope.query.length) {
            filter.schoolOrTeamName = $scope.query;
        }

        angular.forEach($scope.filters, (value, key)=>{
            if(!value){
                delete $scope.filters[key];
            }
        });
        if ($scope.filters['all']) {
                $scope.isFiltered = false;
                queryGames(filter);
        } else {
            if ($scope.filters['my']) {
                if (currentUser.is(ROLES.ATHLETE)) {
                    filter.uploaderTeamId = teamIds;
                } else {
                    filter.uploaderTeamId = team.id;
                }
            }
            if ($scope.filters['scouting']) {
                if (!filter['gameType[]']) filter['gameType[]'] = [];
                filter['gameType[]'].push(GAME_TYPES.SCOUTING.id);
            }
            if ($scope.filters['scrimmage']) {
                if (!filter['gameType[]']) filter['gameType[]'] = [];
                filter['gameType[]'].push(GAME_TYPES.SCRIMMAGE.id);
            }
            if ($scope.filters['conference']) {
                if (!filter['gameType[]']) filter['gameType[]'] = [];
                filter['gameType[]'].push(GAME_TYPES.CONFERENCE.id);
            }
            if ($scope.filters['breakdown']) {
                filter.status = GAME_STATUSES.FINALIZED.id;
            }
            if ($scope.filters['shared']) {
                if (currentUser.is(ROLES.ATHLETE)) {
                    filter.sharedWithUserId = currentUser.id;
                } else {
                    filter.sharedWithUserOrTeam = currentUser.getCurrentRole().id;
                }
            }
            if ($scope.filters['selfEditor']) {
                if (currentUser.is(ROLES.ATHLETE)) {
                    filter.uploaderTeamId = teamIds;
                    filter.selfEdited = true;
                } else {
                    filter.uploaderTeamId = team.id;
                    filter.selfEdited = true;
                }
            }

            $scope.isFiltered = true;
            queryGames(filter);
        }
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
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            $scope.filtering = true;
            let start = 0;
            applyFilter(start);
        }, 500);
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

    $scope.pageChanged = function() {
        document.getElementById('film-home-games-data').scrollTop = 0;
        let start = ($scope.page.currentPage - 1) * ITEMSPERPAGE;
        applyFilter(start);
    };

    function queryGames(filter = {}) {
        filter.count = ITEMSPERPAGE;
        filter.exclude = 'allTelestrations';
        filter.isDeleted = false;
        filter.sortBy = 'datePlayed';
        filter.sortOrder = 'desc';

        if (currentUser.is(ROLES.ATHLETE)) {
            filter.athleteRelatedUserId = currentUser.id;
        } else {
            filter.relatedRoleId = data.games.roleId;
        }

        let gamesPromise = gamesFactory.query(filter);
        let gamesCount = gamesFactory.totalCount(filter, config.api.uri + 'games');
        $q.all([gamesPromise, gamesCount]).then(paginatedGamesData => {
            $scope.games = paginatedGamesData[0];
            $scope.gamesTotalCount = paginatedGamesData[1];
            $scope.filtering = false;
        });
    }

    $scope.bypassClickEvents = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };
}

export default FilmHomeGamesController;
