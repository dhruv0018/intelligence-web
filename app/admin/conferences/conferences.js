const angular = window.angular;
const CONFEREENCEPERPAGE = 18; //18

ConferencesController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'SportsFactory',
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
    conferences
) {
    $scope.allConferences = [];
    $scope.itemPerPage = CONFEREENCEPERPAGE;
    $scope.page = {};
    $scope.page.currentPage = $stateParams.page||1;
    $scope.sports = sports.getMap();
    angular.forEach(conferences, function(conference){
        conference.stringID = (conference.filmExchange) ?  conference.filmExchange.sportsAssociation+'+'+conference.filmExchange.conference+'+'+conference.filmExchange.gender+'+'+conference.filmExchange.sportId : '';
        $scope.allConferences.push(conference);
    });

    if($stateParams.page){
        $scope.filteredConferences = sliceData($stateParams.page);
    }else{
        $scope.filteredConferences = $scope.allConferences.slice(0, CONFEREENCEPERPAGE);
    }

    function sliceData(page) {
        return $scope.allConferences.slice(CONFEREENCEPERPAGE*(page-1), CONFEREENCEPERPAGE*page);
    }

    $scope.pageChanged = function() {
        $state.go('conferences-list', {page: $scope.page.currentPage}, {location: true, notify: false});
        document.getElementById('conference-data').scrollTop = 0;
        $scope.filteredConferences = sliceData($scope.page.currentPage);
    };
}

export default ConferencesController;
