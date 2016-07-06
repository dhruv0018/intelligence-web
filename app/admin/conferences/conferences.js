const angular = window.angular;
const CONFEREENCEPERPAGE = 18; //18

ConferencesController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'SportsFactory',
    'ConferencesFactory',
    'Conference.Data'
];

/**
 * Conferences controller.
 */
function ConferencesController(
    $scope,
    $state,
    $stateParams,
    sports,
    conferencesFactory,
    conferencesData
) {
    $scope.allConferences = [];
    $scope.filteredConferences = [];
    $scope.itemPerPage = CONFEREENCEPERPAGE;
    $scope.filter = {};
    $scope.page = {};
    $scope.page.currentPage = $stateParams.page || 1;
    $scope.sports = sports.getList();
    populateConferencesList(conferencesData);

    $scope.genders = [
        {
            name: 'Men\'s',
            value: 'Male'
        },{
            name: 'Women\'s',
            value: 'Female'
        },{
            name: 'Coed',
            value: 'Coed'
        }
    ];

    if ($stateParams.page) {
        $scope.filteredConferences = sliceData($stateParams.page);
    } else {
        $scope.filteredConferences = $scope.allConferences.slice(0, CONFEREENCEPERPAGE);
    }

    function sliceData(page) {
        return $scope.allConferences.slice(CONFEREENCEPERPAGE*(page-1), CONFEREENCEPERPAGE*page);
    }

    $scope.pageChanged = pageChanged;
    function pageChanged() {
        $state.go('conferences-list', {page: $scope.page.currentPage}, {location: true, notify: false});
        document.getElementById('conference-data').scrollTop = 0;
        $scope.filteredConferences = sliceData($scope.page.currentPage);
    }

    $scope.searchConferences = searchConferences;
    function searchConferences(filter) {
        $scope.searching = true;
        $scope.filteredConferences.length = 0;

        if (filter.filmExchange === false) delete filter.filmExchange;

        $scope.query = conferencesFactory.getConferencesList(filter).then(data => {
            $scope.page.currentPage = 1;
            populateConferencesList(data);
            pageChanged();
        }).finally(function() {
            $scope.searching = false;
        });
    }

    $scope.clearSearchFilter = function() {
        $scope.filter = {};
        searchConferences($scope.filter);
    };

    function populateConferencesList(conferences) {
        $scope.allConferences = [];
        conferences.forEach(conference => {
            conference.stringID = (conference.filmExchange) ?  conference.filmExchange.sportsAssociation+'+'+conference.filmExchange.conference+'+'+conference.filmExchange.gender+'+'+conference.filmExchange.sportId : '';
            $scope.allConferences.push(conference);
        });
    }
}

export default ConferencesController;
