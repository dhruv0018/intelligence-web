const angular = window.angular;

ConferenceController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    '$filter',
    'SportsFactory',
    'Conference.Data'
];

/**
 * Conferences controller.
 */
function ConferenceController(
    $scope,
    $state,
    $stateParams,
    $filter,
    sports,
    conferenceData
) {
    $scope.conferenceStringId = $stateParams.id;
    $scope.conference = conferenceData.conference;
    $scope.sport = sports.get(conferenceData.conference.sportId);
    $scope.teams = conferenceData.teams;
    $scope.filmExchangeAdmins = conferenceData.filmExchangeAdmins;
}

export default ConferenceController;
