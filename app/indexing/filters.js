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
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();

            time = minutes + ':' + seconds;
            time = hours ? hours + ':' + time : time;

            return time;
        };
    }
]);

/**
 * Adds the score to each play.
 * @module Indexing
 * @name scores
 * @type {Filter}
 */
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

