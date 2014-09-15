/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Filters module.
 * @module Filters
 */
var Filters = angular.module('Filters', [
    'Sport.Filter',
    'Humanize.Filter',
    'Film.Filter'
]);

//TODO move this to its own directory
Filters.filter('secondsToTime', function() {
    return function(time) {

        if (!time || time < 0) return '00:00';

        var ss = Math.floor(time % 60);
        ss = (ss < 10) ? '0' + ss : ss;
        var mm = Math.floor(((time - ss) / 60) % 60);
        mm = (mm < 10) ? '0' + mm : mm;
        var hh = Math.floor((time - ss - (mm * 60)) / (60 * 60));
        return ((hh > 0) ? (hh + ':') : '') + mm + ':' + ss;
    };
});

Filters.filter('isNotDeleted', function() {
    return function(arrayOfObjs) {
        var notDeletedObjs = [];

        for (var i = 0; i < arrayOfObjs.length; i++) {
            var obj = arrayOfObjs[i];
            if (obj.isDeleted !== true) notDeletedObjs.push(obj);
        }

        return notDeletedObjs;
    };
});

require('sport');
require('humanize');
require('films');

