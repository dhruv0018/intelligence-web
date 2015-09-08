/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ShareFilm page module.
 * @module ShareFilm
 */
var ShareFilm = angular.module('ShareFilm', [
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
    '$scope', '$state', '$modalInstance', '$timeout', 'config', 'UsersStorage', 'SessionService', 'ShareFilm.Modal', 'BasicModals', 'Film', 'GamesFactory', 'ReelsFactory', 'UsersFactory', 'TeamsFactory', 'PlayersFactory', 'ROLES', 'ROLE_TYPE',
    function controller($scope, $state, $modalInstance, $timeout, config, usersStorage, session, modal, basicModal, film, games, reels, users, teams, players, ROLES, ROLE_TYPE) {

        $scope.config = config;
        $scope.withTeam = false;
        $scope.withOtherUsers = false;
        $scope.withPublic = false;
        $scope.embedSize = 'width:480px;height:458px;';
        $scope.film = film;
        $scope.linkActive = $scope.film.isSharedWithPublic();
        $scope.users = users;
        $scope.usersMap = users.getMap();
        $scope.currentUser = session.getCurrentUser();
        $scope.currentUserIsAthleteRecruit = $scope.currentUser.isAthleteRecruit();
        $scope.ROLES = ROLES;
        $scope.filter = {'role[]': [ROLES.HEAD_COACH.type.id, ROLES.ASSISTANT_COACH.type.id, ROLES.ATHLETE.type.id]};

        //Check if film is a game or reel
        $scope.isGame = angular.isDefined($scope.film.gameType);

        //If user is an athlete, grab all teams they are on
        if ($scope.currentUser.is(ROLES.ATHLETE)) {
            var userRoles = $scope.currentUser.roleTypes[ROLE_TYPE.ATHLETE];
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

        //Share with user and submit
        $scope.shareSubmit = function(user) {
            if (!usersStorage.isStored(user)) {
                usersStorage.set(user);
            }

            $scope.film.shareWithUser(user, isTelestrationsShared());
            $scope.film.save();
        };

        //Stop sharing with user and submit
        $scope.shareRevoke = function(user) {
            $scope.film.stopSharingWithUser(user);
            $scope.film.save();
        };

        //Toggles public share link
        $scope.togglePublicLink = function() {
            $scope.film.togglePublicSharing(isTelestrationsShared());
            $scope.film.save();
        };

        //Share reel with a player on your team toggle
        $scope.shareReelWithPlayerToggle = function(player) {
            if ($scope.film.isSharedWithUser($scope.usersMap[player.userId])) {
                $scope.shareRevoke($scope.usersMap[player.userId]);
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
                $scope.film.stopSharingWithUser($scope.usersMap[player.userId]);
            });
            $scope.film.save();
        };

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

        $scope.shortId = Number($scope.film.id).toString(36);

    }
]);
