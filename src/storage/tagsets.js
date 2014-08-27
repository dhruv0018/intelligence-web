var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('TagsetsStorage', [
    function() {

        this.list = [];
        this.collection = Object.create(null);
    }
]);

