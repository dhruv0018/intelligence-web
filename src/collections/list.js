import Collection from './collection.js';

class List extends Collection {

    /**
     * Constructor:
     * Instantaties List with a new array
     *
     * @param: {Array} (opt) List to copy
     * @return: {List} New list
     */
    constructor(array) {

        array = array || [];

        this.extend(array);

        return this;
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
     * @param: {Boolean} (opt) Add to FRONT
     *         [true] or BACK [false] of
     *         List, default is [false]
     * @return: {Integer} Length
     */
    add(item, location = false) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.add without passing an Object to add');
        }

        return location ? this.unshift(item) : this.push(item);
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

        return (index < 0) ? this.splice(index, 1) : undefined;
    }

    /**
     * Method:sort
     * Sorts entries by property in order
     *
     * @param: {String} (req) Property to sort by
     * @param: {Boolean} (opt) Sort by ASCENDING
     *         [true] or DESCENDING [false],
     *         default is [false]
     * @return: {Array} Sorted List
     */
    sort(property, order = false) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.sort without passing a String property to sort by');
        }

        return this.sort((a, b) => {

            return order ? (a.property - b.property) : (b.property - a.property);
        });
    }

    /**
     * Method:empty
     * Returns empty List status
     *
     * @return: {Boolean} [true] if empty, else [false]
     */
    empty() {

        return this.length <= 0;
    }
}

export default List;
