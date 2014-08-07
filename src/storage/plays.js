var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.service('PlaysStorage', [
    function() {

        this.list = [];
        this.collection = Object.create(null);
    }
]);

