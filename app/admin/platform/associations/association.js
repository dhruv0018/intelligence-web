const angular = window.angular;
const moment = require('moment');

AssociationController.$inject = [
    '$scope',
    '$stateParams',
    '$state',
    '$filter',
    'AssociationsFactory',
    'ConferencesFactory',
    'Iso3166countriesFactory',
    'SportsFactory',
    'BasicModals',
    'AlertsService',
    'ASSOC_TYPES',
    'ASSOC_AGE_LEVELS',
    'ASSOC_AMATEUR_STATUSES'
];

/**
 * Associations page controller
 */
function AssociationController(
    $scope,
    $stateParams,
    $state,
    $filter,
    associations,
    conferences,
    iso3166countries,
    sports,
    basicModals,
    alerts,
    ASSOC_TYPES,
    ASSOC_AGE_LEVELS,
    ASSOC_AMATEUR_STATUSES
) {

    let associationId = Number($stateParams.id);
    $scope.ASSOC_TYPES = ASSOC_TYPES;
    $scope.ASSOC_AGE_LEVELS = ASSOC_AGE_LEVELS;
    $scope.ASSOC_AMATEUR_STATUSES = ASSOC_AMATEUR_STATUSES;
    $scope.countries = iso3166countries.getList();
    $scope.sports = sports.getMap();
    $scope.isExistingAssociation = false;
    $scope.regions = [];
    $scope.competitionLevels = [];
    $scope.conferences = [];
    $scope.conferenceSports = [];
    $scope.availableConferenceSports = [];
    $scope.filmExchanges = [];
    $scope.newCompetitionLevel = {};
    $scope.newConference = {};
    $scope.newFilmExchange = {};
    $scope.newFilmExchangeConference = null;
    $scope.updateRegionList = updateRegionList;

    // Update association related info if existing association
    if (associationId) {
        $scope.association = associations.get(associationId);
        $scope.isExistingAssociation = true;
        updateCompetitionLevels();
        updateConferences();
        updateRegionList();
        updateFilmExchanges();
    }

    // Initialize association object
    $scope.association = $scope.association || associations.create({
        isSanctioning: false,
        isDefunct: false,
        about: ''
    });

    $scope.$watch('association.isSanctioning', function(n, o) {
        if(n !== o){
            $scope.form.$setDirty();
        }
    });

    $scope.$watch('association.isDefunct', function(n, o){
        if(n !== o){
            $scope.form.$setDirty();
        }
    });

    $scope.$on('delete-competition-level', () => {
        updateCompetitionLevels();
    });

    $scope.$on('delete-conference', () => {
        updateConferences();
    });

    $scope.$on('delete-film-exchange', () => {
        updateFilmExchanges();
    });

    $scope.$on('added-conference-sport', () => {
        generateConferenceSportList();
    });

    $scope.clickCheckBox = function(item) {
        $scope[item] = !$scope[item];
        $scope.form.$setDirty();
    };

    // Association Info Related Methods
    $scope.deleteAssocation = function() {
        if(associationId) {
            let deleteAssociationModal = basicModals.openForConfirm({
                title: 'Delete Association',
                bodyText: 'Are you sure you want to delete this association?',
                buttonText: 'Yes'
            });

            deleteAssociationModal.result.then(function deleteModalCallback() {
                associations.delete($scope.association)
                    .then(function() {
                        //go to the association main page
                        $state.go('associations').then(() => {
                            alerts.add({
                                type: 'success',
                                message: 'Association deleted successfully!'
                            });
                        });
                    })
                    .catch(function(response) {
                        //stay at current page but alert the error
                        // alerts.add({
                        //     type: 'danger',
                        //     message: response
                        // });
                    });
            });
        }
    };

    function updateRegionList() {
        if ($scope.association.country) {
            iso3166countries.getRegions($scope.association.country).then((regionData) => {
                $scope.regions = regionData;
            });
        }
    }

    // Competition Level Related Methods
    $scope.addCompetitionLevel = function(competitionLevel) {
        if (competitionLevel.name && competitionLevel.code) {
            competitionLevel.sortOrder = 1;
            competitionLevel.isDefunct = 0;
            competitionLevel.sportsAssociation = $scope.association.code;
            associations.createCompetitionLevel($scope.association.code, competitionLevel).then(() => {
                updateCompetitionLevels();
                $scope.newCompetitionLevel = {};
                $scope.form.$setPristine();
            });
        }
    };

    function updateCompetitionLevels() {
        associations.loadCompetitionLevels($scope.association.code).then(response => {
            $scope.competitionLevels = response;
        });
    }

    // Conference Related Methods
    $scope.addConference = function(newConference) {
        if (newConference.name && newConference.code) {
            let conference = conferences.create({
                name: newConference.name,
                code: newConference.code,
                competitionLevel: newConference.competitionLevel || null,
                sortOrder: 1,
                isDefunct: 0,
                sportsAssociation: $scope.association.code
            });
            conferences.createConference($scope.association.code, conference).then(() => {
                $scope.newConferenceCode = conference.code;
                updateConferences();
                $scope.newConference = {};
                $scope.form.$setPristine();
            });
        }
    };

    function updateConferences() {
        conferences.loadConferences($scope.association.code).then(response => {
            $scope.conferences = response.sort((a, b) => moment(b.createdAt).diff(a.createdAt));
        });
    }

    // Film Exchange Related Methods
    $scope.onSelectConferenceForFilmExchange = function(conferenceSport) {
        $scope.newFilmExchange.sportsAssociation = conferenceSport.sportsAssociation;
        $scope.newFilmExchange.conference = conferenceSport.conference.code;
        $scope.newFilmExchange.gender = conferenceSport.gender;
        $scope.newFilmExchange.sportId = conferenceSport.sportId;
        $scope.newFilmExchange.isVisibleToTeams = false;
        $scope.newFilmExchange.name = conferenceSport.name;
    };

    $scope.addFilmExchange = function(filmExchange) {
        conferences.createFilmExchange(filmExchange).then(() =>{
            $scope.newFilmExchange = {};
            $scope.newFilmExchangeConference = null;
            updateFilmExchanges();
        });
    };

    $scope.getConferenceForFilmExchange = function(conferenceCode) {
        return $scope.conferences.find(conference => conference.code === conferenceCode);
    };

    $scope.cancelFilmExchangeCreation = function() {
        $scope.newFilmExchange = {};
        $scope.newFilmExchangeConference = null;
    };

    function generateConferenceSportList() {
        let usedConferenceSports = [];
        conferences.getAllConferenceSportsForAssociation($scope.association.code).then(response => {
            $scope.conferenceSports = response;
            $scope.conferenceSports.forEach(conferenceSport => {
                conferenceSport.name = conferenceSport.conference.name + ' - ' + $filter('formattedConferenceGender')(conferenceSport.gender) + ' ' + $scope.sports[conferenceSport.sportId].name;
                $scope.filmExchanges.forEach(filmExchange => {
                    if (conferenceSport.conference.code === filmExchange.conference &&
                        conferenceSport.gender === filmExchange.gender &&
                        conferenceSport.sportId === filmExchange.sportId) {
                        usedConferenceSports.push(conferenceSport);
                    }
                });
            });

            $scope.availableConferenceSports = $scope.conferenceSports.filter(conferenceSport => {
                if (!usedConferenceSports.some(usedConferenceSport => conferenceSport === usedConferenceSport)) {
                    return conferenceSport;
                }
            });
            $scope.availableConferenceSports = $scope.availableConferenceSports.sort((a,b) => a.name > b.name);
        });
    }

    function updateFilmExchanges() {
        conferences.getAllFilmExchangesForAssociation($scope.association.code).then(response => {
            $scope.filmExchanges = response.sort((a, b) => moment(b.createdAt).diff(a.createdAt));
            generateConferenceSportList();
        });
    }
}

export default AssociationController;
