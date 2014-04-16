/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');


FilmHome.service('filters', function () {


    var filtersData = {
        filters: {
            'all': false,
            'others': {
                'film': true,
                'reels': false,
                'scouting': false,
                'scrimmage': false
            }
        },
        disableOthers: function () {
            var filterKeys = Object.keys(this.filters.others);
            for (var filterKeyIndex in filterKeys) {
                var filterName = filterKeys[filterKeyIndex];
                this.filters.others[filterName] = false;
            }
        },
        disableAll: function () {
            var filterKeys = Object.keys(this.filters.others);
            for (var filterKeyIndex in filterKeys) {
                var filterName = filterKeys[filterKeyIndex];
                if(this.filters.others[filterName] === true) {
                    this.filters.all = false;
                    return;
                }
            }
        }
    };

    filtersData.filterKeys = Object.keys(filtersData.filters.others);


    return filtersData;
});


/**
 * User controller. Controls the view for adding and editing a single user.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Coach.FilmHome.controller', [
    '$rootScope', '$scope', '$state', 'SessionService', 'TeamsFactory', 'GamesFactory', 'Coach.FilmHome.Data', 'filters',
    function controller($rootScope, $scope, $state, session, teams, games, data, filtersData) {

        data.then(function (data) {
            $scope.games = data.games;
            $scope.team = data.team;
        });

        $scope.filters = filtersData.filters;

        $scope.$watch('filters.all', function (all) {
            if(all === true) {
                filtersData.disableOthers();
            }
        });

        $scope.$watch('filters.others', function (others) {
            filtersData.disableAll();
        }, true);



        $scope.search = function (filter) {
            //searches all games for a team if there is no other search parameter
            if (!filter.query || filter.query.length === 0) {
                games.getList({
                    teamId: $scope.teamId
                }, function (games) {
                    $scope.games = games;
                });
            } else {
                games.getList({
                    team: filter.query
                }, function (games) {
                    $scope.games = games;
                }, function(){
                    //setup for no search results
                });
            }
        };

        $scope.mockRoster = [
            {
                firstName: 'Hector',
                lastName: 'Rosa',
                position: 'MB',
                jerseyNumbers: {
                    '9001': 22
                },
                picture:{
                    url: 'assets/tmp/roster/0000.jpg'
                }
            },
            {
                firstName: 'Billy',
                lastName: 'Blau',
                position: 'MH',
                jerseyNumbers:{
                    '9001': 33
                },
                picture:{
                    url: 'assets/tmp/roster/0001.jpg'
                }
            },
            {
                firstName: 'Greg',
                lastName: 'Grunhilda',
                position: 'RH',
                jerseyNumbers:{
                    '9001': 44
                },
                picture:{
                    url: 'assets/tmp/roster/0002.jpg'
                }
            },
            {
                firstName: 'Walter',
                lastName: 'Gelber',
                position: 'LH',
                jerseyNumbers: {
                    '9001': 55
                },
                picture:{
                    url: 'assets/tmp/roster/0003.jpg'
                }
            },
            {
                firstName: 'Ringo',
                lastName: 'Braun',
                position: 'DS',
                jerseyNumbers:{
                    '9001': 66
                },
                picture:{
                    url: 'assets/tmp/roster/0004.jpg'
                }
            },
            {
                firstName: 'Richard',
                lastName: 'Beige',
                position: 'H',
                jerseyNumbers:{
                    '9001': 77
                },
                picture:{
                    url: 'assets/tmp/roster/0005.jpg'
                }
            },
            {
                firstName: 'Kurt',
                lastName: 'Violett',
                position: 'B',
                jerseyNumbers:{
                    '9001': 88
                },
                picture:{
                    url: 'assets/tmp/roster/0006.jpg'
                }
            },
            {
                firstName: 'Illian',
                lastName: 'Mauve',
                position: 'OB',
                jerseyNumbers:{
                    '9001': 99
                },
                picture:{
                    url: 'assets/tmp/roster/0007.jpg'
                }
            },
            {
                firstName: 'David',
                lastName: 'Weisse',
                position: 'S',
                jerseyNumbers:{
                    '9001': 14
                },
                picture:{
                    url: 'assets/tmp/roster/0008.jpg'
                }
            },
            {
                firstName: 'Alfonso',
                lastName: 'Schwarz',
                position: 'H',
                jerseyNumbers:{
                    '9001': 25
                },
                picture:{
                    url: 'assets/tmp/roster/0009.jpg'
                }
            },
            {
                firstName: 'Anthony',
                lastName: 'Grau',
                position: 'B',
                jerseyNumbers:{
                    '9001': 36
                },
                picture:{
                    url: 'assets/tmp/roster/0000.jpg'
                }
            },
            {
                firstName: 'Stan',
                lastName: 'Turk',
                position: 'DS',
                jerseyNumbers:{
                    '9001': 47
                },
                picture:{
                    url: 'assets/tmp/roster/0001.jpg'
                }
            },
            {
                firstName: 'Arnold',
                lastName: 'Silber',
                position: 'H',
                jerseyNumbers:{
                    '9001': 58
                },
                picture:{
                    url: 'assets/tmp/roster/0002.jpg'
                }
            },
            {
                firstName: 'Scott',
                lastName: 'Gold',
                position: 'B',
                jerseyNumbers:{
                    '9001': 69
                },
                picture:{
                    url: 'assets/tmp/roster/0003.jpg'
                }
            }
        ];

    }
]);

