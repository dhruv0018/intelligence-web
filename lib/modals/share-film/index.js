const template = require('./template.html');
const angular = window.angular;

/**
 * ShareFilm page module.
 * @module ShareFilm
 */
const ShareFilm = angular.module('ShareFilm', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ShareFilm.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('share-film.html', template);
    }
]);

/**
 * ShareFilm modal dialog.
 * @module ShareFilm
 * @name ShareFilm.Modal
 * @type {value}
 */
ShareFilm.value('ShareFilm.ModalOptions', {

    templateUrl: 'share-film.html',
    controller: 'ShareFilm.controller',
    controllerAs: 'shareFilm'
});

/**
 * ShareFilm modal dialog.
 * @module ShareFilm
 * @name ShareFilm.Modal
 * @type {value}
 */
ShareFilm.service('ShareFilm.Modal', [
    '$modal', 'ShareFilm.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(film) {

                var resolves = {

                    resolve: {

                        Film: function() { return film; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * ShareFilm controller.
 * @module ShareFilm
 * @name ShareFilm.controller
 * @type {controller}
 */
ShareFilm.controller('ShareFilm.controller', [
    '$scope',
    '$state',
    '$modalInstance',
    '$timeout',
    'config',
    'UsersStorage',
    'TeamsStorage',
    'SchoolsStorage',
    'SessionService',
    'ShareFilm.Modal',
    'BasicModals',
    'Film',
    'GamesFactory',
    'ReelsFactory',
    'UsersFactory',
    'TeamsFactory',
    'PlayersFactory',
    'FilmExchangeFactory',
    'ROLES',
    'ROLE_TYPE',
    function controller(
        $scope,
        $state,
        $modalInstance,
        $timeout,
        config,
        usersStorage,
        teamsStorage,
        schoolsStorage,
        session,
        modal,
        basicModal,
        film,
        games,
        reels,
        users,
        teams,
        players,
        filmExchangeFactory,
        ROLES,
        ROLE_TYPE
    ) {

        $scope.config = config;
        $scope.withTeam = false;
        $scope.withOtherUsers = false;
        $scope.withPublic = false;
        $scope.withFilmExchange = false;
        $scope.showFilmExchangeOption = false;
        $scope.filmExchangeShareConfirm = false;
        $scope.embedSize = 'width:480px;height:458px;';
        $scope.film = film;
        $scope.linkActive = $scope.film.isSharedWithPublic();
        $scope.users = users;
        $scope.usersMap = users.getMap();
        $scope.teamsMap = teams.getMap();
        $scope.currentUser = session.getCurrentUser();
        $scope.currentUserIsAthleteRecruit = $scope.currentUser.isAthleteRecruit();
        $scope.ROLES = ROLES;
        $scope.filter = {'role[]': [ROLES.HEAD_COACH.type.id, ROLES.ASSISTANT_COACH.type.id, ROLES.ATHLETE.type.id]};
        $scope.filmExchanges = [];
        $scope.sharedFilmExchanges = [];

        let currentRole = session.getCurrentRole();

        //Check if film is a game or reel
        $scope.isGame = angular.isDefined($scope.film.gameType);

        //Check if film is shared publicly
        if ($scope.film.isSharedWithPublic()) {
            $scope.linkActive = true;
        }

        updateNonPublicShares();

        let teamIds = [];
        $scope.nonPublicShares.forEach(function(share, index) {
            if(share.sharedWithTeamId) {
                /* Since doing a get on an nonexisting team id will cause an error and
                * stop executing the foreach, adding the try catch is necessary to load the missing
                * team object(s)
                */
                try {
                    teams.get(share.sharedWithTeamId);
                } catch(err) {
                    teamIds.push(share.sharedWithTeamId);
                }
            }
        });

        if (teamIds.length){
            teams.load(teamIds);
        }

        //If user is an athlete, grab all teams they are on
        if ($scope.currentUser.is(ROLES.ATHLETE)) {
            let userRoles = $scope.currentUser.getRoles(ROLE_TYPE.ATHLETE);
            $scope.teams = [];

            userRoles.forEach(function(role, index) {
                $scope.teams.push(teams.get(userRoles[index].teamId));
            });

            $scope.team = $scope.teams[0];
        } else {

            $scope.team = teams.get($scope.currentUser.currentRole.teamId);
        }

        //Get list of players that can be shared with
        var playersFilter = { rosterId: $scope.team.roster.id };
        $scope.playersList = players.getList(playersFilter);
        $scope.playersWithAccounts = [];

        $scope.playersList.forEach(function(player, index) {
            if (player.userId !== null) {
                $scope.playersWithAccounts.push(player);
            }
        });

        $scope.shareVideoOptions = [
            {
                name: 'Sharing raw film only',
                value: false
            },
            {
                name: 'Sharing raw film and breakdown',
                value: true
            }
        ];

        if($scope.currentUser.is(ROLES.COACH) && $scope.isGame) {
            // Get film exchanges this game is already shared with
            film.getFilmExchanges($scope.film.id).then(response => {
                $scope.sharedFilmExchanges = response;
                // Get all film exchanges user's team is a part of
                teams.getFilmExchanges(currentRole.teamId).then(response => {
                    response.map(filmExchange => {
                        if (isGameSharedWithFilmExchange(filmExchange)) {
                            filmExchange.gameIsShared = true;
                        } else {
                            filmExchange.gameIsShared = false;
                        }
                        $scope.filmExchanges.push(filmExchange);
                    });
                    if ($scope.filmExchanges.length) $scope.showFilmExchangeOption = true;
                });
            });
        }

        //Share with user and submit
        $scope.shareSubmit = function(user) {
            let team = user.team;
            let school = user.school;
            const role = user.role;

            /* unset the extra values that comes along with the typeahead before storing them */
            if (!usersStorage.isStored(user)) {
                let userForStorage = angular.copy(user);
                delete userForStorage.team;
                delete userForStorage.school;
                delete userForStorage.role;
                usersStorage.set(userForStorage);
            }

            if (user.team && !teamsStorage.isStored(team)) {
                teamsStorage.set(team);
            }

            if (user.school && !schoolsStorage.isStored(school)) {
                schoolsStorage.set(school);
            }

            if (role && user.is(ROLES.COACH, role)) {
                $scope.film.shareWithTeam(team, isTelestrationsShared());
            } else {
                $scope.film.shareWithUser(user, isTelestrationsShared());
            }

            $scope.film.save();
            updateNonPublicShares();
        };

        //Stop sharing with user and submit
        $scope.shareRevoke = function(share) {
            $scope.film.stopSharing(share);
            $scope.film.save();
            updateNonPublicShares();
        };

        //Toggles public share link
        $scope.togglePublicLink = function() {
            $scope.film.togglePublicSharing(isTelestrationsShared());
            $scope.film.save();
        };

        //Share reel with a player on your team toggle
        $scope.shareReelWithPlayerToggle = function(player) {
            if ($scope.film.isSharedWithUser($scope.usersMap[player.userId])) {
                $scope.shareRevoke($scope.film.getShareByUserId(player.userId));
            } else {
                $scope.shareSubmit($scope.usersMap[player.userId]);
            }
        };

        $scope.selectAllPlayers = function() {
            $scope.playersWithAccounts.forEach(function(player, index) {
                $scope.film.shareWithUser($scope.usersMap[player.userId], isTelestrationsShared());
            });
            $scope.film.save();
        };

        $scope.deselectAllPlayers = function() {
            $scope.playersWithAccounts.forEach(function(player, index) {
                if($scope.film.isSharedWithUserId(player.userId)){
                    $scope.film.stopSharing($scope.film.getShareByUserId(player.userId));
                }
            });
            $scope.film.save();
        };

        //Shares game with film exchange
        $scope.shareGamesWithFilmExchange = function() {

            // Create list of all film exchanges to share with
            let filmExchangesToShareWith = $scope.filmExchanges.filter(filmExchange => {
                return filmExchange.gameIsShared === true && !isGameSharedWithFilmExchange(filmExchange);
            });

            filmExchangesToShareWith.forEach(filmExchange => {
                if (filmExchange.gameIsShared && !isGameSharedWithFilmExchange(filmExchange)) {
                    let gameForFilmExchange = {
                        gameId: film.id,
                        videoId: film.video.id,
                        addedByUserId: $scope.currentUser.id,
                        addedByTeamId: currentRole.teamId,
                        sportsAssociation: filmExchange.sportsAssociation,
                        conference: filmExchange.conference,
                        gender: filmExchange.gender,
                        sportId: filmExchange.sportId
                    };

                    filmExchangeFactory.shareGameWithFilmExchange(gameForFilmExchange).then(response => {
                        if (filmExchange === filmExchangesToShareWith[filmExchangesToShareWith.length - 1]) {
                            $scope.filmExchangeShareConfirm = true;
                        }
                    });
                }
            });
        };

        //Logic to enable/disable Share button when in film exchange view
        $scope.shareButtonIsActive = function() {
            return $scope.filmExchanges.some(filmExchange => {
                return filmExchange.gameIsShared === true && !isGameSharedWithFilmExchange(filmExchange);
            });
        };

        //Checks if a film exchange has this game shared with it already
        $scope.isGameSharedWithFilmExchange = isGameSharedWithFilmExchange;
        function isGameSharedWithFilmExchange(filmExchange) {
            return $scope.sharedFilmExchanges.some(sharedFilmExchange => {
                return (filmExchange.sportsAssociation === sharedFilmExchange.sportsAssociation &&
                        filmExchange.conference === sharedFilmExchange.conference &&
                        filmExchange.gender === sharedFilmExchange.gender &&
                        filmExchange.sportId === sharedFilmExchange.sportId);
            });
        }

        function isTelestrationsShared() {

            var result;

            if ($scope.withPublic && $scope.currentUser.is(ROLES.COACH)) {

                result = false;

            } else if ($scope.withPublic && $scope.currentUser.is(ROLES.ATHLETE)) {

                result = true;

            } else if ($scope.withTeam) {

                result = true;

            } else if ($scope.withOtherUsers) {

                result = false;

            } else {

                result = false;
            }

            return result;
        }

        function updateNonPublicShares() {
            $scope.nonPublicShares = $scope.film.getNonPublicShares();
        }

        $scope.shortId = Number($scope.film.id).toString(36);

        //TODO: There are lot of complex validations in the template. add the validators in the scope and use them in template

    }
]);
