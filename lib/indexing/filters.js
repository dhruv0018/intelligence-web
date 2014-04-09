/* Fetch angular from the browser scope */
var angular = window.angular;

var moment = require('moment');

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Filters time in milliseconds into humanized format
 * @module Indexing
 * @name time
 * @type {Filter}
 */
Indexing.filter('time', [
    function filter() {

        return function(time) {

            var duration = moment.duration(time, 'seconds');
            var seconds = duration.seconds();
            var minutes = duration.minutes();

            return minutes + ':' + seconds;
        };
    }
]);

Indexing.filter('scores', [
    'IndexingService',
    function filter(indexing) {

        return function(plays) {

            return angular.forEach(plays, function(play) {

                play.score = indexing.calculateScore(play);
            });
        };
    }
]);

