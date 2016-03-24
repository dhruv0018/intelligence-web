const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('AssociationsStorage', [
    'BaseStorage', 'AssociationsFactory',
    function(BaseStorage, associations) {

        let AssociationsStorage = Object.create(BaseStorage);

        AssociationsStorage.factory = associations;
        AssociationsStorage.description = associations.description;

        return AssociationsStorage;
    }
]);
