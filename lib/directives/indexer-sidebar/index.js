/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Add IndexerSidebar
 * @module IndexerSidebar
 */
var IndexerSidebar = angular.module('IndexerSidebar', []);

/* Cache the template file */
IndexerSidebar.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexer-sidebar.html', require('./template.html'));
    }
]);

/**
 *IndexerSidebar directive.
 * @module IndexerSidebar
 * @name IndexerSidebar
 * @type {Directive}
 */
IndexerSidebar.directive('indexerSidebar', [
    function directive() {

        var indexersidebar = {

            restrict: TO += ELEMENTS,
            templateUrl: 'indexer-sidebar.html',
            controller: 'IndexerSidebar.controller'
        };

        return indexersidebar;
    }
]);

/**
 * IndexerSidebar controller
*/
IndexerSidebar.controller('IndexerSidebar.controller', [
    '$scope',
    'config',
    'SessionService',
    function(
        $scope,
        config,
        session
    ) {

        $scope.currentUser = session.getCurrentUser();
        $scope.footballFAQ = config.links.indexerFAQ.football.uri;
        $scope.volleyballFAQ = config.links.indexerFAQ.volleyball.uri;
        $scope.basketballFAQ = config.links.indexerFAQ.basketball.uri;
    }
]);
