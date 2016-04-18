var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('FilmExchangeStorage', [
    'BaseStorage', 'FilmExchangeFactory',
    function(BaseStorage, filmExchange) {

        var FilmExchangeStorage = Object.create(BaseStorage);

        FilmExchangeStorage.factory = filmExchange;
        FilmExchangeStorage.description = filmExchange.description;

        return FilmExchangeStorage;
    }
]);
