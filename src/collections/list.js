/**
 * Creates a List
 * @class List
 * @classdesc Takes an array as a data source and adds convenience methods
 * including a linked list-like capabilities.
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

        this.data = array;
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
     *
     * @type {Integer}
     */
    get length () {

        return this.data.length;
    }

    set length (value) {

        if (!Number.isInteger(value)) {

            throw new Error('List length setter must be given an integer value!');
        }

        this.data.length = value;
    }

    /**
     * Returns the backing store array, and only the array
     *
     * @method toJSON
     * @returns {Array}
     */
    toJSON () {

        return this.data.slice(0);
    }

    /**
     * Removes all entries in the list
     *
     * @method clear
     * @returns {List} - The array that was cleared
     */
    clear () {

        return this.data.splice(0, Number.MAX_VALUE);
    }

    /**
     * Getter for elements at a specified index
     *
     * @type {}
     */
    get (index) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.get without passing a index');
        }

        return this.data[index];
    }

    /**
     * Getter for first element
     *
     * @type {}
     */
    get first () {

        return this.data[0];
    }

    /**
     * Getter for last element
     *
     * @type {}
     */
    get last () {

        return this.data[this.data.length - 1];
    }

    /**
     * Adds a new entry to the list
     *
     * @method add
     * @param {Object|Array} item    - Item(s) to add
     * @param {Boolean} [toEnd=true] - Add to end (false), or beginning (true)
     * @returns {Integer}            - Length
     */
    add (item, toEnd = true) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.add without passing an Object to add');
        }

        /* If multiple items, concatenate array to exisiting array */
        if (Array.isArray(item)) {

            this.data = toEnd ? this.data.concat(item) : item.concat(this.data);
            return this.length;

        /* If single item, just push/shift */
        } else {

            return toEnd ? this.data.push(item) : this.data.unshift(item);
        }
    }

    /**
     * Removes an entry from the list
     *
     * @method remove
     * @param {Object} item         - Item to remove
     * @returns {Integer|undefined} - Array length
     */
    remove (item) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.remove without passing an Object to remove');
        }

        let removed = [];

        while (this.includes(item)) {

            let itemIndex = this.data.indexOf(item);

            removed = removed.concat(this.data.splice(itemIndex, 1));
        }

        return removed;
    }

    /**
     * Returns empty List status
     *
     * @method isEmpty
     * @returns {Boolean} - true if empty, else false
     */
    isEmpty () {

        return !this.data.length;
    }
}

export default List;
