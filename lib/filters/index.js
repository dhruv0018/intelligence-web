/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Filters module.
 * @module Filters
 */
var Filters = angular.module('Filters', [
    'Arenas.Filter',
    'Time.Filter',
    'Sport.Filter',
    'Humanize.Filter',
    'Film.Filter',
    'Normalize.Filter',
    'Height.Filter',
    'Weight.Filter',
    'Padding.Filter',
    'toArray.Filter'
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

    return function(objects) {

        return objects.filter(function(object) {

            return object.isDeleted !== true;
        });
    };
});

/**
* Filter ORFilter
* @input : The source array
* @inputExpressionObject : A pattern object can be used to filter specific
* properties on objects contained by array. For example {name:"M", phone:"1"}
* predicate will return an array of items which have property name containing
* "M" OR property phone containing "1".
**/
Filters.filter('ORFilter', ['$filter', function($filter) {
    return function(input, inputExpressionObject) {
        let res = [];
        let filteredRes = [];
        for (var i in inputExpressionObject) {
            var partialFilterExpression = {};
            partialFilterExpression[i] = inputExpressionObject[i];
            var filtered = $filter('filter')(input, partialFilterExpression);
            res = res.concat(filtered);
        }

        let resourceIds = [];

        //eliminates any mutually duplicate results found by the filters
        res.forEach((result) => {
            if (resourceIds.indexOf(result.id) < 0) {
                resourceIds.push(result.id);
                filteredRes.push(result);
            }
        });

        return filteredRes;
    };
}]);

require('arenas');
require('time');
require('sport');
require('humanize');
require('films');
require('normalize');
require('height');
require('weight');
require('padding');
require('to-array');
