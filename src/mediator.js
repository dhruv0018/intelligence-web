var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class Mediator
 * A mediator that will notify a colleague. The mediator pushes items into a
 * pool. When instructed to flush the items the mediator will sort the pool with
 * the given strategy, if no strategy is given it uses a standard array sort.
 * After sorting the pool it will notify the given colleague of the winner.
 * Where the winner is the first item in the pool.
 * @param {Function} colleague - a colleague to notify.
 * @param {Function} strategy - a strategy to employ when deciding on the
 * @param {Function} criteria - the criteria for consideration
 * winner. Should be a comparator function. Defaults to standard array sort.
 */
function Mediator(colleague, strategy, criteria) {

    /* A pool of items to mediate. */
    this.pool = [];

    /* A colleague to notify after mediation. */
    this.colleague = colleague;

    /* A strategy to employ during mediation. */
    this.strategy = strategy || Array.sort;

    /* The criteria used to determine if an item should enter mediation. */
    this.criteria = criteria || function() { return true; };
}

/**
 * Pushes an item into the pool of items to mediate.
 * @param {item} item - can be anything that can be compared with the given strategy.
 */
Mediator.prototype.push = function(item) {

    /* If the item matches the criteria. */
    if (this.criteria(item)) {

        /* Push the item into the pool. */
        this.pool.push(item);
    }
};

/**
 * Flushes the pool of items; sorting them first, then notifying the mediators
 * colleague. After flushing the pool is emptied.
 */
Mediator.prototype.flush = function() {

    /* Sort the pool with the given strategy. */
    if (this.pool.length) this.pool.sort(this.strategy);

    /* Determine the winner, the item that placed first in the pool after sort. */
    var winner = this.pool[0];

    /* Notify the given colleague of the winner. */
    if (winner) this.colleague(winner);

    /* Empty the pool. */
    this.pool = [];
};

/**
 * @module IntelligenceWebClient
 * @name Mediator
 * @type {value}
 */
IntelligenceWebClient.value('Mediator', Mediator);
