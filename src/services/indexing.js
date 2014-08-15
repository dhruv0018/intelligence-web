var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.factory('IndexingService', [
    function() {

        var IndexingService = {

            reset: function(game) {

                this.game = game;
            }
        };

        return IndexingService;
    }
]);
