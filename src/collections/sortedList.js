/**
 * Creates a Sorted List
 * @class List
 * @classdesc Extends base List class: takes an array as a data source and adds
 * the ability to sort the array automatically.
 * @file src/collections/list.js
 */

import List from './list';

class SortedList extends List {

    /**
     * Instantaties Sorted List as a new array
     *
     * @constructs SortedList
     * @param {Array} [array]         - Array to copy
     * @param {String} [sortProperty] - Property to sort array by
     * @param {Boolean} descending    - Sort array descending/ascending
     */
    constructor (array = [], sortProperty = false, descending = true) {

        super(array);

        if (!sortProperty) {

            throw new Error('Invoked List.constructor without passing a sort property');
        }

        this.sortProperty = sortProperty;
        this.descending   = descending;

        this.sort();
    }

    /**
     * Sorts entries by property in order
     *
     * @method sort
     * @returns {Array} - Sorted List
     */
    sort () {

        /* Create a temporary Array to sort with */
        return this.data.sort((a, b) => {

            a = a[this.sortProperty];
            b = b[this.sortProperty];

            if (a > b) {

                return this.descending ? 1 : -1;
            } else if (a < b) {

                return this.descending ? -1 : 1;
            }

            /* a must be equal to b */
            return 0;
        });
    }

    /**
     * Adds new items to the array and then sorts according the sort settings
     *
     * @method add
     * @param {Object|Array} item - Item(s) to add
     * @returns {Array}            - Sorted List
     */
    add (item) {

        super.add(item);

        return this.sort();
    }
}

export default SortedList;
