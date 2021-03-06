/*globals require*/
/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template Constants */
const templateUrl = 'lib/directives/film/template.html';

/**
 * Film
 * @module Film
 */
let Film = angular.module('film', [
    'ui.router',
    'ui.bootstrap',
    'thumbnail'
]);

/**
 * Film directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Film.directive('krossoverFilm', krossoverFilm);

krossoverFilm.$inject = [
    'ROLES',
    'TeamsFactory',
    'UsersFactory',
    'GamesFactory',
    'ReelsFactory',
    'SessionService',
    'ShareFilm.Modal',
    'GAME_TYPES_IDS',
    'GAME_TYPES',
    'AuthenticationService',
    'STATE_NAMES',
    '$state',
    'GameStatesService'
];

function krossoverFilm (
    ROLES,
    teams,
    users,
    games,
    reels,
    session,
    ShareFilmModal,
    GAME_TYPES_IDS,
    GAME_TYPES,
    auth,
    STATE_NAMES,
    $state,
    gameStates
) {

    const film = {

        restrict: TO += ELEMENTS,

        templateUrl: templateUrl,

        scope: {
            film: '=',
            filmExchanges: '=?'
        },

        replace: true,

        link: link
    };

    function link ($scope, element, attrs) {

        const currentUser = session.getCurrentUser();
        const currentUserId = session.getCurrentUserId();
        const teamId = session.getCurrentTeamId();
        const film = $scope.film;
        $scope.STATE_NAMES = STATE_NAMES;
        $scope.filmExchanges = $scope.filmExchanges || [];
        $scope.isCopiedFromTeam = auth.isLoggedIn && !!film.copiedFromTeamId;
        $scope.currentUser = currentUser;

        if($scope.isCopiedFromTeam) {
            $scope.copiedFromTeam = teams.get(film.copiedFromTeamId);
        }

        //Check if film is a game or reel
        $scope.isGame = angular.isDefined($scope.film.gameType);

        const isBreakdownShared =  ($scope.isGame && $scope.film.isBreakdownSharedWithCurrentUser());

        $scope.currentUser = currentUser;
        $scope.COACH = ROLES.COACH;
        $scope.ATHLETE = ROLES.ATHLETE;

        // Create an element ID for film share CTA
        $scope.filmShareElemId = ['film-share', $scope.isGame ? 'game' : 'reel', $scope.film.id, 'cta'].join('-');

        $scope.isUploader = $scope.film.uploaderUserId === currentUser.id;

        //Check if film is shared with user or team
        $scope.isShared = (!$scope.isUploader &&
                ($scope.film.isSharedWithUser(currentUser) || $scope.film.isSharedWithTeamId(currentUser.currentRole.teamId)));

        $scope.isCoachOnUploaderTeam =
            currentUser.is(ROLES.COACH) &&
            currentUser.currentRole.teamId === $scope.film.uploaderTeamId;

        $scope.hideFilm = false;

        if (currentUser.is(ROLES.ATHLETE) && $scope.isGame && !$scope.film.video.isComplete()) {
            $scope.hideFilm = true;
        } else if ($scope.isShared && $scope.isGame && !$scope.film.video.isComplete()) {
            $scope.hideFilm = true;
        }

        $scope.ShareFilmModal = ShareFilmModal;

        let uploaderUser = {};
        $scope.uploaderName = '';
        const isCopied = $scope.isGame && $scope.film.isCopied();
        if ($scope.isShared) {
            if ($scope.film.isSharedWithUser(currentUser)) {
                uploaderUser = users.get($scope.film.getShareByUser(currentUser).userId);
            } else if ($scope.film.isSharedWithTeamId(currentUser.currentRole.teamId)) {
                uploaderUser = users.get($scope.film.getShareByTeamId(currentUser.currentRole.teamId).userId);
            }
        } else {
            uploaderUser = users.get($scope.film.uploaderUserId);
        }

        if (uploaderUser.id === currentUser.id) {
            $scope.uploaderName = 'you';
        } else {
            $scope.uploaderName = uploaderUser.firstName + ' ' + uploaderUser.lastName;
        }

        if ($scope.isGame) {
            const isDelivered = film.isDelivered();
            // $scope.isReady = false;
            // if ($scope.film.isDelivered()) {
            //     $scope.isReady = true;
            // }
        }

        $scope.gameStatesOptions = [];
        switch ($scope.film.description) {
            case 'games':
                /* If the current user is NOT the owner of the film. */
                if ($scope.isShared) {
                    $scope.filmTitle =  isBreakdownShared ?  'Breakdown' :  'Raw Film';
                }

                /* If the current user is the owner of the film. */
                else {

                    $scope.filmTitle = isDelivered ? 'Breakdown' : 'Raw Film';
                    $scope.gameStatesOptions = gameStates.get(film);
                }
                break;
            case 'reels':
                $scope.filmTitle = 'Reel';
                break;
            default:
                $scope.filmTitle = 'Other';
        }

        $scope.selectState = function selectState(state) {
            const stateParams = {
                id : film.id
            };
            $state.go(state.name, stateParams);
        };
    }

    return film;
}

export default Film;
