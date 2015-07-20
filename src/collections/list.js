/**
 * Creates a List
 * @class List
 * @classdesc Takes an array as a data source and adds convenience methods
 * including a linked list-like capabilities.
 * @file src/collections/list.js
 */
class List {

    /**
     * Instantaties List as a new array
     *
     * @constructs List
     * @param {Array} [array] - Array to use as backing data store
     */
    constructor (array = []) {

        if (!Array.isArray(array)) {

            throw new Error('List data must be an Array!');
        }

        this.data  = array;
        this.index = 0;
    }

    /**
     * Returns the next element in the array based on the index.
     *
     * @method next
     * @returns {Object} - The array element at the new index.
     */
    next () {

        this.index++;

        if (this.index >= this.data.length) {

            this.index = 0;
        }

        return this.get(index);
    }

    /**
     * Returns the previous element in the array based on the index.
     *
     * @method previous
     * @returns {Object} - The array element at the new index.
     */
    previous () {

        this.index--;

        if (this.index < 0) {

            this.index = this.data.length;
        }

        return this.get(index);
    }

    /**
     * Simulates the ES7 includes method
     *
     * @method includes
     * @param {Object} searchElement - The element to search for
     * @param {Integer} fromIndex    - The array index to begin searching from
     * @returns {Boolean}            - Whether the element exists in the array
     */
    includes (searchElement, fromIndex) {

        return !!~this.data.indexOf(searchElement, fromIndex);
    }

    /**
     * Getter/Setter for the length of the data store
     * @type {Integer}
     */
    get length () {

        return this.data.length;
    }

    set length (value) {

        if (Number(value) !== value || value % 1 !== 0) {

            throw new Error('List length setter must be given an integer value!');
        }

        this.data.length = value;
    }

    /**
     * Returns a copy of the array, and only the array
     *
     * @method identity
     * @returns {Array} - A copy of the data backing store.
     */
    identity () {

        return this.data.slice(0);
    }

    /**
     * Returns a copy of the array, and only the array
     *
     * @method toJSON
     * @returns {Array}
     */
    toJSON () {

        return this.identity();
    }
    /* NEW */

    /**
     * Removes all entries in the list
     *
     * @method clear
     * @returns {List} - The array that was cleared
     */
    clear() {

        return this.data.splice(0, Number.MAX_VALUE);
    }

    /**
     * Return the element at the specified index
     *
     * @method get
     * @param {Integer} index - Index of array element
     * @returns {Object}      - Entry at index
     */
    get (index) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.get without passing a index');
        }

        return this.data[index];
    }

    /**
     * Return first element
     *
     * @method first
     * @returns {Object} - First element, OR undefined
     */
    first () {

        return this.data.slice(0, 1).pop();
    }

    /**
     * Return last element
     *
     * @method last
     * @returns {Object} - Last element, OR undefined
     */
    last () {

        return this.data.slice(this.length - 1).pop();
    }

    /**
     * Adds a new entry to the list
     *
     * @method add
     * @param {Object|Array} item    - Item(s) to add
     * @param {Boolean} [toEnd=true] - Add to end (false), or begging (true)
     * @returns {Integer}            - Length
     */
    add (item, toEnd = true) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.add without passing an Object to add');
        }

        if (Array.isArray(item)) {

            // Add new array to either beginning or end of exisitng array
            if (toEnd) {

                this.data.push(item);
            } else {

                this.data.unshift(item);
            }

            // Flatten array
            this.data.reduce((a, b) => a.concat(b));

            return this.length;
        } else {

            return toEnd ? this.data.push(item) : this.data.unshift(item);
        }
    }

    /**
     * Removes an entry from the list
     *
     * @method remove
     * @param {Object} item - Item to remove
     * @returns {Integer}   - Length, OR undefined
     */
    remove (item) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.remove without passing an Object to remove');
        }

        if (this.includes(item)) {

            let itemIndex = this.data.indexOf(item);
            return this.data.splice(itemIndex, 1);
        }
    }

    /**
     * Returns empty List status
     *
     * @method isEmpty
     * @returns {Boolean} - true if empty, else false
     */
    isEmpty () {

        return !!this.data.length;
    }
}

export default List;
