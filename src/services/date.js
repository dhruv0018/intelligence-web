var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);


IntelligenceWebClient.factory('NewDate', function() {
    return {
        generate: function(existingDate) {
            var dateZeroTime = (existingDate) ? new Date(existingDate) : new Date();
            dateZeroTime.setUTCHours(0,0,0,0);
            return dateZeroTime;
        }
    };
});
