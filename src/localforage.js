var localforage = require('localforage');

window.localforage = localforage;

require('angular-localforage');

var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.config([
    '$localForageProvider',
    function($localForageProvider) {

        $localForageProvider.config({

            name: pkg.name,
            storeName: 'storage'
        });
    }
]);

