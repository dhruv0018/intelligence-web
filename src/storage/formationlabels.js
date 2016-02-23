const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FormationLabelsStorage', [
    'BaseStorage', 'FormationLabelsFactory',
    function(BaseStorage, formationlabels) {

        let FormationLabelsStorage = Object.create(BaseStorage);

        FormationLabelsStorage.factory = formationlabels;
        FormationLabelsStorage.description = formationlabels.description;

        return FormationLabelsStorage;
    }
]);
