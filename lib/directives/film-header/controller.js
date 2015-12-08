/* Fetch angular from the browser scope */
var angular = window.angular;

/**
* Film Header
* @module Film Header
*/
var filmHeader = angular.module('film-header');

/**
 * Film Header Controller.
 * @module Film Header
 * @name Film Header
 * @type {Controller}
 */
filmHeader.controller('filmHeader.Controller', [
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
    function controller(
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
        $state
    ){

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
            } else {

                $scope.isGame = false;

                if (isAthlete) {
                    athleteRoles.forEach(athleteRole => {
                        let team = teams.get(athleteRole.teamId);
                        if (team.getSport().id === SPORTS.BASKETBALL.id) {
                            $scope.isBasketball = true;
                        }
                    });

                    // Get teams this athlete plays for
                    $scope.teams = athleteRoles.map(role => teams.get(role.teamId));
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
                $scope.film.remove();

                if ($scope.film.isPublishedToProfile($scope.user)) {
                    // Remove from published reels
                    $scope.film.unpublishFromProfile($scope.user);
                    $scope.user.save();
                }

                account.gotoUsersHomeState();
            });
        };
    }
]);
