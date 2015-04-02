import Collection from './collection.js';

class List extends Collection {

    /**
     * Constructor:
     * Instantaties List with a new array
     *
     * @param: {Array} (opt) List to copy
     * @return: {List} New list
     */
    constructor(array = []) {

        this.extend(array);
    }

    /**
     * Getter:length
     * Returns length of list
     *
     * @return: {Integer} length
     */
    get length() {

        return this.length;
    }

    /**
     * Method:clear
     * Removes all entries in the list
     *
     * @return: {List} Empty list
     */
    clear() {

        return this.slice();
    }

    /**
     * Method:get
     * Return entry at index
     *
     * @param: {Integer} (req) Index of entry
     * @return: {Object} Entry at index
     */
    get(index) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.get without passing a index');
        }

        return this[index];
    }

    /**
     * Method:first
     * Return first entry
     *
     * @return: {Object} First entry, OR undefined
     */
    first() {

        return this[0];
    }

    /**
     * Method:last
     * Return lst entry
     *
     * @return: {Object} Last entry, OR undefined
     */
    last() {

        return this[this.length - 1];
    }

    /**
     * Method:add
     * Adds a new entry to the list
     *
     * @param: {Object} (req) Item(s) to add,
     *         (arrays accepted)
     * @param: {Boolean} (opt) Add to FIRST
     *         [false] or LAST [true] of
     *         List, default is [true]
     * @return: {Integer} Length
     */
    add(item, toLast = true) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.add without passing an Object to add');
        }

        return toLast ? this.push(item) : this.unshift(item);
    }

    /**
     * Method:remove
     * Removes an entry from the list
     *
     * @param: {Object} (req) Item to
     *         remove (arrays not accepted)
     * @return: {Integer} Length, OR undefined
     */
    remove(item) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.remove without passing an Object to remove');
        }

        let index = this.indexOf(item);

        if (!~index) {

            return undefined;
        }

        return this.splice(index, 1);
    }

    /**
     * Method:sort
     * Sorts entries by property in order
     *
     * @param: {String} (req) Property to sort by
     * @param: {Boolean} (opt) Sort by ASCENDING
     *         [false] or DESCENDING [true],
     *         default is [true]
     * @return: {Array} Sorted List
     */
    sort(property, descending = true) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.sort without passing a String property to sort by');
        }

        return this.sort((a, b) => {

            return descending ? (b.property - a.property) : (a.property - b.property);
        });
    }

    /**
     * Method:isEmpty
     * Returns empty List status
     *
     * @return: {Boolean} [true] if empty, else [false]
     */
    isEmpty() {

        return !!this.length;
    }
}

export default List;
