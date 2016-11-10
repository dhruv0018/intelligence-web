/* Fetch angular from the browser scope */
const angular = window.angular;

/* Component dependencies */
import GamesRawFilm from './raw-film/';
import GamesBreakdown from './breakdown/';
import GamesDownAndDistance from './down-and-distance';
import GamesInfo from './game-info';
import GamesStats from './stats';
import GamesFormations from './formations';
import GamesArenaChart from './arena-chart';
import GamesSelfEditor from './self-editor';

/**
* Coach game area raw film page module.
* @module Games
*/
const Games = angular.module('Games', [
    'Games.RawFilm',
    'Games.Breakdown',
    'Games.DownAndDistance',
    'Games.Info',
    'Games.Stats',
    'Games.Formations',
    'Games.ArenaChart',
    'Games.SelfEditor'
]);

Games.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const shortGames = {
            name: 'ShortGames',
            url: '/g/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams',
                function($state, $stateParams) {
                    var gameId = parseInt($stateParams.id, 36);
                    $state.go('Games', {id: gameId});
                }
            ]
        };

        const GamesRestricted = {
            name: 'Games.Restricted',
            url: 'games/:id/restricted',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'app/games/restricted.html'
                }
            }
        };

        const Games = {
            name: 'Games',
            url: '/games/:id',
            parent: 'base',
            onEnter: [
                '$state', '$stateParams', 'SessionService', 'GamesFactory', 'ROLES', 'ROLE_TYPE',
                function($state, $stateParams, session, games, ROLES, ROLE_TYPE) {

                    let currentUser = session.currentUser;
                    let gameId = Number($stateParams.id);
                    let game = games.get(gameId);
                    let teamIds = [];

                    // TODO: make user factory function to handle this
                    if (currentUser.is(ROLES.ATHLETE)) {
                        // Get all teams user is athlete on
                        let athleteRoles = currentUser.getRoles(ROLE_TYPE.ATHLETE);
                        teamIds = athleteRoles.map(role => role.teamId);
                    } else {
                        teamIds = [session.getCurrentTeamId()];
                    }

                    if (!game.isAllowedToView(teamIds, currentUser.id)) {
                        $state.go('Games.Restricted', { id: gameId });
                    }
                }
            ],
            onExit: [
                'PlayManager',
                function(playManager) {
                    playManager.clear();
                }
            ],
            views: {
                'main@root': {
                    templateUrl: 'app/games/template.html',
                    controller: 'Games.controller'
                }
            },
            resolve: {
                'Games.Data': [
                    '$q',
                    '$stateParams',
                    'PositionsetsFactory',
                    'GamesFactory',
                    'ReelsFactory',
                    'TeamsFactory',
                    'UsersFactory',
                    'LeaguesFactory',
                    'CustomtagsFactory',
                    'TagsetsFactory',
                    'SessionService',
                    'AuthenticationService',
                    'ROLES',
                    'ROLE_TYPE',
                    function(
                        $q,
                        $stateParams,
                        positionsets,
                        games,
                        reels,
                        teams,
                        users,
                        leagues,
                        customtags,
                        tagsets,
                        session,
                        auth,
                        ROLES,
                        ROLE_TYPE
                    ) {

                        let gameId = Number($stateParams.id);

                        return games.load(gameId).then(function() {

                            let game = games.get(gameId);
                            const currentUserId = session.getCurrentUserId();

                            let Data = {
                                leagues: leagues.load(),

                                positionsets: positionsets.load(),

                                reels: reels.load({ relatedUserId: currentUserId }),

                                tagsets: tagsets.load()
                            };

                            let currentUser = session.getCurrentUser();
                            let isCoach = currentUser.is(ROLES.COACH);
                            let isAthlete = currentUser.is(ROLES.ATHLETE);
                            let isTeamUploadersTeam = false;

                            if (isCoach) {
                                isTeamUploadersTeam = game.isTeamUploadersTeam(session.getCurrentTeamId());
                            } else if (isAthlete) {
                                let athleteRoles = currentUser.getRoles(ROLE_TYPE.ATHLETE);
                                isTeamUploadersTeam = athleteRoles.some(role => game.isTeamUploadersTeam(role.teamId));
                            }

                            if (auth.isLoggedIn && isTeamUploadersTeam) {
                                Data.customtags = customtags.load({ teamId: game.uploaderTeamId });
                            }

                            let userIds = [];
                            userIds.push(game.uploaderUserId);
                            game.getUserShares().forEach(function(share) {

                                userIds.push(share.sharedWithUserId);
                            });
                            if (userIds.length) Data.users = users.load(userIds);

                            let teamIds = [];
                            if (game.teamId) teamIds.push(game.teamId);
                            if (game.opposingTeamId) teamIds.push(game.opposingTeamId);
                            if (game.uploaderTeamId) teamIds.push(game.uploaderTeamId);
                            if (teamIds.length) Data.teams = teams.load(teamIds);

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(shortGames);
        $stateProvider.state(GamesRestricted);
        $stateProvider.state(Games);
    }
]);

GamesController.$inject = [
    'Features',
    'DEVICE',
    '$rootScope',
    'TELESTRATION_PERMISSIONS',
    '$scope',
    '$state',
    '$stateParams',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'UsersFactory',
    'AuthenticationService',
    'SessionService',
    'SPORTS',
    'SPORT_IDS',
    'ROLES',
    'ROLE_TYPE',
    'GameStatesService'
];

function GamesController(
    features,
    DEVICE,
    $rootScope,
    TELESTRATION_PERMISSIONS,
    $scope,
    $state,
    $stateParams,
    games,
    teams,
    leagues,
    users,
    auth,
    session,
    SPORTS,
    SPORT_IDS,
    ROLES,
    ROLE_TYPE,
    gameStates
) {

    let gameId = Number($stateParams.id);
    let game = games.get(gameId);
    let team = teams.get(game.uploaderTeamId);
    let league = leagues.get(team.leagueId);
    let currentUser = session.getCurrentUser();
    let sport = SPORTS[SPORT_IDS[league.sportId]];
    let breakdownShared = game.publicShare && game.publicShare.isBreakdownShared || game.isBreakdownSharedWithCurrentUser();
    let transcodeCompleted = game.video.isComplete();
    let uploader = users.get(game.uploaderUserId);
    let uploaderIsCoach = uploader.is(ROLES.COACH);
    let isUploader = game.isUploader(currentUser.id);
    let isCoach = currentUser.is(ROLES.COACH);
    let isAthlete = currentUser.is(ROLES.ATHLETE);
    let isTelestrationsSharedWithCurrentUser = game.isTelestrationsSharedWithUser(currentUser);
    let isTelestrationsSharedPublicly = game.isTelestrationsSharedPublicly();
    let isMobile = $rootScope.DEVICE === DEVICE.MOBILE;
    let isDelivered = game.isDelivered();
    let isTeamUploadersTeam = false;

    if (isCoach) {
        isTeamUploadersTeam = game.isTeamUploadersTeam(session.getCurrentTeamId());
    } else if (isAthlete) {
        let athleteRoles = currentUser.getRoles(ROLE_TYPE.ATHLETE);
        isTeamUploadersTeam = athleteRoles.some(role => game.isTeamUploadersTeam(role.teamId));
    }

    /* Scope */

    $scope.game = game;
    $scope.teams = teams.getCollection();
    $scope.team = $scope.teams[game.teamId];
    $scope.opposingTeam = $scope.teams[game.opposingTeamId];
    $scope.league = league;

    // Watch for header display
    $scope.hideHeader = false;
    $scope.$on('toggleHeaderDisplay', function(toggleHeaderDisplayEvent, isSelfEditing) {
        $scope.hideHeader = isSelfEditing;
    });
    $scope.$on('$stateChangeStart', function(event) {
        $scope.hideHeader = false;
    });

    // services
    $scope.auth = auth;

    // Telestrations Permissions
    if (isMobile) {
        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.NO_ACCESS;
    }
    // uploader could be a coach or an athlete (they have permissions to edit by default)
    else if (isUploader) {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.EDIT;

    }
    // Coaches on the same team as the uploader can edit
    else if (isTeamUploadersTeam && isCoach) {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.EDIT;

    } else if (isTelestrationsSharedWithCurrentUser || isTelestrationsSharedPublicly) {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.VIEW;

    } else {

        $scope.telestrationsPermissions = TELESTRATION_PERMISSIONS.NO_ACCESS;
    }

    /* Define view selector states */
    $scope.gameStates = gameStates.get(game);

}

Games.controller('Games.controller', GamesController);

export default Games;
