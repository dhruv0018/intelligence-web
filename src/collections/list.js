class List extends Array {

    /**
     * Constructor:
     * Instantaties List as a new array
     *
     * @param: {Array} (opt) Array to copy
     */
    constructor (array = []) {

        super();

        let index = 0;
        while (index < array.length) {

            this.push(array[index]);
            index++;
        }
    }

    /**
     * Method: includes
     * Simulates the ES7 includes method
     *
     * @return: {Boolean}
     */
    includes (searchElement, fromIndex) {

        return !!~this.indexOf(searchElement, fromIndex);
    }

    // TODO: Try this with .slice(0)

    /**
     * Method: setLength
     * Simulates setting the length property to truncate and array
     *
     * @return: {Array}
     */
    setLength (value) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.setLength without passing a value');
        }

        if (value <= this.length) {

            return this.splice(value, this.length - value);
        } else {

            let index = this.length;
            while (index < value) {

                this.push(undefined);
                index++;
            }
        }
    }

    /**
     * Method: identity
     * Returns a copy of the array, and only the array
     *
     * @return: {Array}
     */
    identity () {

        return this.slice(0);
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

        return this.splice(0, Number.MAX_VALUE);
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

        return this[index];
    }

    /**
     * Method:first
     * Return first entry
     *
     * @return: {Object} First entry, OR undefined
     */
    first () {

        return this.slice(0, 1).pop();
    }

    /**
     * Method:last
     * Return lst entry
     *
     * @return: {Object} Last entry, OR undefined
     */
    last () {

        return this.slice(this.length - 1).pop();
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
    remove (index) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.remove without passing an Object to remove');
        }

        if (this.includes(index)) {

            return this.splice(index, 1);
        }
    }

    /**
     * Method:isEmpty
     * Returns empty List status
     *
     * @return: {Boolean} [true] if empty, else [false]
     */
    isEmpty () {

        return !!this.length;
    }

    /**
     * Method:fromProto
     * Returns a Real Array with a prototype matching this class
     *
     * @static
     * @return: {Array}
     */
    static fromProto (array = []) {

        let instance = array.slice(0);
        instance.__proto__ = List.prototype;

        return instance;
    }
}

export default List;
