class List {

    /**
     * Constructor:
     * Instantaties List as a new array
     *
     * @param: {Array} (opt) Array to copy
     */
    constructor (array = []) {

        if (!Array.isArray(array)) {

            throw new Error('List data must be an Array!');
        }

        this.data = array;
    }

    /**
     * Method: includes
     * Simulates the ES7 includes method
     *
     * @return: {Boolean}
     */
    includes (searchElement, fromIndex) {

        return !!~this.data.indexOf(searchElement, fromIndex);
    }

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
     * Method: identity
     * Returns a copy of the array, and only the array
     *
     * @return: {Array}
     */
    identity () {

        return this.data.slice(0);
    }

    /**
     * Method: toJSON
     * Returns a copy of the array, and only the array
     *
     * @return: {Array}
     */
    toJSON () {

        return this.identity();
    }
    /* NEW */

    /**
     * Method:clear
     * Removes all entries in the list
     *
     * @return: {List} Empty list
     */
    clear() {

        return this.data.splice(0, Number.MAX_VALUE);
    }

    /**
     * Method:get
     * Return entry at index
     *
     * @param: {Integer} (req) Index of entry
     * @return: {Object} Entry at index
     */
    get (index) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.get without passing a index');
        }

        return this.data[index];
    }

    /**
     * Method:first
     * Return first entry
     *
     * @return: {Object} First entry, OR undefined
     */
    first () {

        return this.data.slice(0, 1).pop();
    }

    /**
     * Method:last
     * Return lst entry
     *
     * @return: {Object} Last entry, OR undefined
     */
    last () {

        return this.data.slice(this.length - 1).pop();
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
    add (item, toLast = true) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.add without passing an Object to add');
        }

        return toLast ? this.data.push(item) : this.data.unshift(item);
    }

    /**
     * Method:remove
     * Removes an entry from the list
     *
     * @param: {Object} (req) Item to
     *         remove (arrays not accepted)
     * @return: {Integer} Length, OR undefined
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
     * Method:isEmpty
     * Returns empty List status
     *
     * @return: {Boolean} [true] if empty, else [false]
     */
    isEmpty () {

        return !!this.data.length;
    }
}

export default List;
