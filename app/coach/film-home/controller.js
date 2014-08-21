/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');




/**
 * User controller. Controls the view for adding and editing a single user.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Coach.FilmHome.controller', [
    '$rootScope', '$scope', '$state', '$filter', 'GamesFactory', 'UsersFactory', 'PlayersFactory', 'SessionService', 'Coach.Data', 'Coach.FilmHome.GameFilters',
    function controller($rootScope, $scope, $state, $filter, games, users, players, session,  data, filtersData) {
        $scope.playersList = data.playersList;
        $scope.games = data.games.getCollection();
        $scope.gamesList = data.games.getList();
        $scope.teams = data.teams.getCollection();
        $scope.team = $scope.teams[session.currentUser.currentRole.teamId];
        $scope.roster = $scope.team.roster;
        $scope.activeRoster = players.constructActiveRoster($scope.playersList, $scope.roster.id);
        $scope.query = '';
        $scope.filters = filtersData.filters;

        $scope.$watch('filters.all', function(all) {

            if (all === true) {
                filtersData.disableOthers();
            }

            else if (filtersData.othersDisabled === true) {
                $scope.filters.all = true;
            }
        });

        $scope.$watchCollection('filters.others', function(others) {
            filtersData.watchOthers();
        });

        $scope.search = function(query) {
            if (query.length === 0) {
                $scope.gameList = data.games.getList();
            }

            var filteredGames = [];

            Object.keys($scope.games).forEach(function(key) {
                var game = this[key];

                if (typeof $scope.teams[game.teamId] !== 'undefined' && $scope.teams[game.teamId].name.indexOf(query) >= 0 ||
                    typeof $scope.teams[game.opposingTeamId] !== 'undefined' && $scope.teams[game.opposingTeamId].name.indexOf(query) >= 0) {
                    filteredGames.push(game);
                }

                $scope.gamesList = filteredGames;

            }, $scope.games);

        };

        //TODO-- temp athlete -- remove this
        $scope.tempAthlete = {
            user: users.get(59),
            players: [players.get(633)]
        };

    }
]);

