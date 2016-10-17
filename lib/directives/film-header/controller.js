/* Fetch angular from the browser scope */
var angular = window.angular;

filmHeaderController.$inject = [
    '$scope',
    'config',
    'GAME_TYPES_IDS',
    'GAME_TYPES',
    'ROLES',
    'SPORTS',
    'SessionService',
    'AccountService',
    'AuthenticationService',
    'ShareFilm.Modal',
    'BasicModals',
    'GamesFactory',
    '$stateParams',
    'TeamsFactory',
    '$state',
    'ROLE_TYPE',
    'CopyRawFilm.Modal',
    '$timeout'
];

/**
 * Film Header Controller.
 * @module Film Header
 * @name Film Header
 * @type {Controller}
 */
function filmHeaderController(
    $scope,
    config,
    GAME_TYPES_IDS,
    GAME_TYPES,
    ROLES,
    SPORTS,
    session,
    account,
    auth,
    ShareFilmModal,
    modals,
    games,
    $stateParams,
    teams,
    $state,
    ROLE_TYPE,
    CopyRawFilmModal,
    $timeout
) {
    if (auth.isLoggedIn) {

        const gameId = $stateParams.id;
        const currentTeam = teams.get(session.getCurrentTeamId());
        const currentLeagueId = currentTeam.leagueId;
        const currentSport = currentTeam.getSport();
        const currentUser = session.getCurrentUser();
        const userRoles = currentUser.getRoles(ROLE_TYPE.HEAD_COACH).concat(currentUser.getRoles(ROLE_TYPE.ASSISTANT_COACH));

        let teamIds = [];
        userRoles.forEach(userRole => {
            if(session.getCurrentTeamId() !== userRole.teamId && !userRole.tenureEnd){
                teamIds.push(userRole.teamId);
            }
        });

        if(teamIds.length > 0) {
            teams.load(teamIds).then((teams) => {
                let teamsAllowedForCopying = [];
                teams.forEach(team => {
                    if(team.getSport() === currentSport && team.leagueId === currentLeagueId) {
                        teamsAllowedForCopying.push(team);
                    }
                });
                $scope.allowedTeams = teamsAllowedForCopying;
            });
        } else {
            $scope.allowedTeams = [];
        }

        $scope.game = $scope.film;
        $scope.removingShare = false;
        $scope.shareWithMe = $scope.game.getShareByCurrentUser();
        $scope.copyingRawFilm =  false;
        $scope.finishedSaving = false;
        $scope.copyFilm = ()=>{
            let options = {
                scope: $scope
            };

            let modal = CopyRawFilmModal.open(options);
            modal.result.then(function() {
                $scope.copyingRawFilm =  false;
                $scope.finishedSaving = true;
                $timeout(function(){$scope.finishedSaving = false;}, 3000);
            });
        };

        $scope.$watch('copyingRawFilm', function(newValue, oldValue){
            $scope.copyingRawFilm = newValue;
        });

        $scope.$watch('finishedSaving', function(newValue, oldValue){
            $scope.finishedSaving = newValue;
        });
    }

    $scope.teams = [];
    $scope.user = session.getCurrentUser();
    $scope.currentUserIsAthleteRecruit = $scope.user.isAthleteRecruit();
    let isAthlete = $scope.user.is(ROLES.ATHLETE);
    let isCoach = $scope.user.is(ROLES.COACH);

    // Get teams user is athlete on
    if (isAthlete) {
        let activeRoles = $scope.user.getActiveRoles();
        let athleteRoles = activeRoles.filter(role => $scope.user.is(role, ROLES.ATHLETE));
    }

    /* State Booleans */
    /* TODO: Should really be using something like $stateParams.gameId or $stateParams.reelId */
    if (angular.isDefined($scope.film)) {
        if($scope.film.description === 'games') {

            if ($scope.film.teamId) {
                let team = teams.get($scope.film.teamId);
                $scope.teams.push(team);
                $scope.isBasketball = team.getSport().id === SPORTS.BASKETBALL.id;
            }

            if ($scope.film.opposingTeamId) {
                let opposingTeam = teams.get($scope.film.opposingTeamId);
                $scope.teams.push(opposingTeam);
            }

            $scope.isGame = true;
            $scope.isScoutingGame = $scope.film.gameType === GAME_TYPES.SCOUTING.id;
        } else {

            $scope.isGame = false;

            if (isAthlete) {
                athleteRoles.forEach(athleteRole => {
                    let team = teams.get(athleteRole.teamId);
                    $scope.teams.push(team);
                    if (team.getSport().id === SPORTS.BASKETBALL.id) {
                        $scope.isBasketball = true;
                    }
                });
            } else if (isCoach) {
                let team = teams.get(session.getCurrentTeamId());
                $scope.isBasketball = team.getSport().id === SPORTS.BASKETBALL.id;
            }
        }

        $scope.isReel = $scope.film.description === 'reels';
    }
    if (angular.isDefined($scope.play)) $scope.isClip = $scope.play.description === 'plays';

    //TODO: Add a watch to the current state
    $scope.state = $state;

    /* Logic for film title */

    let setGameTitle = function() {
        if (!$scope.isReel && !$scope.isClip) {
            let gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
            let gameType = GAME_TYPES[gameTypeId];
            $scope.filmTitle = gameType.name;
        }
    };

    $scope.filmTitle = 'Other';

    if ($scope.isClip) {
        $scope.filmTitle = 'Clip';
    } else if ($scope.isReel) {
        $scope.filmTitle = 'Reel';
    } else if ($scope.isGame) {
        setGameTitle();
    }

    $scope.$watch('film.gameType', setGameTitle);

    //Get film exchanges for current user
    $scope.filmExchanges = [];
    if (isCoach && $scope.isGame) {
        teams.getFilmExchanges(currentTeam.id).then(response => $scope.filmExchanges = response);
    }

    // Get league ids for WSC
    if ($scope.isGame && $scope.film.teamId) {
        $scope.currentLeagueId = teams.get($scope.film.teamId).leagueId;
    } else if ($scope.isReel) {
        if (isCoach) {
            $scope.currentLeagueId = currentLeagueId;
        } else if (isAthlete) {
            $scope.currentLeagueId = teams.get($scope.gameForReel.teamId).leagueId;
        }
    }

    /* Data for share film modal */

    $scope.ShareFilmModal = ShareFilmModal;

    if (isCoach) {
        $scope.isOnUploaderTeam = $scope.user.currentRole.teamId === $scope.film.uploaderTeamId;
    } else if (isAthlete) {
        $scope.isOnUploaderTeam = athleteRoles.some(athleteRole => athleteRole.teamId === $scope.film.uploaderTeamId);
    }
    $scope.isCoachOnUploaderTeam = isCoach && $scope.isOnUploaderTeam;
    $scope.userIsLoggedIn = auth.isLoggedIn;
    $scope.isUploader = $scope.user.id === $scope.film.uploaderUserId;

    $scope.validVideo = $scope.isReel || $scope.film.video.isComplete();

    /* Functionality for reels */
    $scope.config = config;
    $scope.userCanPublishReel =
        ($scope.user.profile &&
        isAthlete &&
        $scope.userIsLoggedIn &&
        $scope.isUploader);

    $scope.deleteReel = function() {

        let deleteReelModal = modals.openForConfirm({
            title: 'Delete Reel',
            bodyText: 'Are you sure you want to delete this reel?',
            buttonText: 'Yes'
        });

        deleteReelModal.result.then(function deleteModalCallback() {
            $scope.film.remove().then(function(){
                account.gotoUsersReelState();
            });

            if ($scope.user.profile && $scope.film.isPublishedToProfile($scope.user)) {
                // Remove from published reels
                $scope.film.unpublishFromProfile($scope.user);
                $scope.user.save();
            }
        });
    };

    $scope.removeShare = function() {
        if(!$scope.removingShare) {
            let removeShareModal = modals.openForConfirm({
                title: 'Remove Share',
                bodyText: 'Are you sure you want to remove this share?',
                bodySubtext: 'This will remove the content from your film home.',
                buttonText: 'Yes, Remove'
            });

            removeShareModal.result.then(function removeShareModalCallback() {
                $scope.game.stopSharing($scope.shareWithMe);
                $scope.removingShare = true;
                $scope.game.save().then(function(){
                    if($scope.isReel) {
                        account.gotoUsersReelState();
                    }
                    else {
                        account.gotoUsersHomeState();
                    }
                });
            });
        }
    };
}

export default filmHeaderController;
