const angular = window.angular;
const CONFEREENCEPERPAGE = 30; //max number of conferences shown per page

ConferencesController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'SportsFactory',
    'ConferencesFactory',
    'Conferences.Data',
    'AdminSearchService'
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
    conferencesData,
    searchService
) {
    $scope.allConferences = [];
    $scope.filteredConferences = [];
    $scope.itemPerPage = CONFEREENCEPERPAGE;
    $scope.filter = searchService.conferences.filter;
    $scope.page = {};
    $scope.page.currentPage = $stateParams.page || 1;
    $scope.totalCount = conferencesData.count;
    $scope.sports = sports.getList();
    $scope.filteredConferences = conferencesData.data;

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

    $scope.pageChanged = pageChanged;
    function pageChanged() {
        document.getElementById('conference-data').scrollTop = 0;
        let filter = angular.copy($scope.filter);
        filter.page = $scope.page.currentPage;
        filter.count = CONFEREENCEPERPAGE;
        conferencesFactory.getConferencesList(filter, false).then(responses =>{
            if(responses.count){
                $scope.totalCount = responses.count;
            }
            $scope.filteredConferences = responses.data;
        });
    }

    $scope.searchConferences = searchConferences;
    function searchConferences(filter) {
        $scope.searching = true;
        $scope.filteredConferences.length = 0;

        if (filter.filmExchange === false) delete filter.filmExchange;
        filter.start = 0;
        filter.count = CONFEREENCEPERPAGE;

        $scope.query = conferencesFactory.getConferencesList(filter).then(responses => {
            $scope.page.currentPage = 1;
            if(responses.count){
                $scope.totalCount = responses.count;
            }
            $scope.filteredConferences = responses.data;
        }).finally(function() {
            $scope.searching = false;
        });
    }

    $scope.clearSearchFilter = function() {
        searchService.conferences.clear();
        $scope.filter = {};
        searchConferences($scope.filter);
    };

    // Restore the state of the previous search from the service
    if (Object.keys($scope.filter).length) {
        $scope.searchConferences($scope.filter);
    }
}

export default ConferencesController;
