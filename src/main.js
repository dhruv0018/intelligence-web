require('angular');
require('bootstrap');

var component = require('../build/build.js');

var IntelligenceWebClient = angular.module('intelligence-web-client', ['ui.bootstrap']);

IntelligenceWebClient.run(function() {

});

angular.bootstrap(document, ['intelligence-web-client']);

