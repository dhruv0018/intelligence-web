const dependencies = [
    '$scope',
    'teamId'
];

/**
 * @param {Object} $scope - Angular $scope
 */
const KrossoverConferenceSelectController = (
    $scope,
    teamId
) => {

    $scope.teamId = teamId;

    $scope.confereces = [{
        'id': 1,
        'sportsAssociation': 'US-WHAT',
        'conference': 'LacIvy8',
        'gender': 'Male',
        'sportId': 1
    },
    {
        'id': 2,
        'sportsAssociation': 'US-WHAT2',
        'conference': 'LacIvy2',
        'gender': 'Male',
        'sportId': 1
    }];

    $scope.teamConferences = [{
        'id': 1,
        'sportsAssociation': 'US-WHAT',
        'conference': 'LacIvy8',
        'gender': 'Male',
        'sportId': 1,
        'teamId': 20677,
        'competitionLevelOverride': null,
        'createdAt': '2016-04-19T18:10:57+00:00',
        'updatedAt': '2016-04-19T18:10:57+00:00'
    },
    {
        'id': 2,
        'sportsAssociation': 'US-WHAT2',
        'conference': 'LacIvy2',
        'gender': 'Male',
        'sportId': 1,
        'teamId': 20677,
        'competitionLevelOverride': null,
        'createdAt': '2016-04-19T18:10:57+00:00',
        'updatedAt': '2016-04-19T18:10:57+00:00'
    }];

    $scope.delete = function(conference){
        alert('xx');
    };

};

KrossoverConferenceSelectController.$inject = dependencies;

export default KrossoverConferenceSelectController;
