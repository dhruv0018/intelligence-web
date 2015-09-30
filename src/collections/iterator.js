/**
 * Creates an Iterator
 * @class Iterator
 * @classdesc Takes an array as data and abstracts state tracking
 */
class Iterator {
    /**
     * Instantiates Iterator for array based datastructures
     *
     * @constructs Iterator
     * @param {Array} [data] - Array to use as data store
     */
    constructor(data) {
        if ( !(data instanceof Array) ) {
            throw Error('You must pass in an array or subclass of array');
        }
        this.data = data;
        this.index = 0;
    }

    /**
     * Returns the next item in the data and advances the index position.
     *
     * @method next
     * @returns {Object}
     */
    next() {
        this.index++;
        return this.current;
    }

    /**
     * Returns the previous item in the data and moves the index backwards.
     *
     * @method previous
     * @returns {Object}
     */
    prev() {
        this.index--;
        return this.current;
    }

    /**
     * Returns the current item
     *
     * @method current
     * @returns {Object}
     */
    get current() {
        let value = this.data[this.index] || null;
        return {
            value,
            done: !this.hasNext()
        };
    }

    /**
     * Getter for setting the current item
     * @param {Object} item    - item which new index will be based on
     */
    set current(item) {
        this.index = this.data.indexOf(item);
    }

    /**
     * Returns if there is another item after the current item
     *
     * @method hasNext
     * @returns {Boolean}
     */
    hasNext() {
        return this.index + 1 < this.data.length;
    }

    /**
     * Returns if there is another item before the current item
     *
     * @method hasPrev
     * @returns {Boolean}
     */
    hasPrev() {
        return this.index > 0;
    }
}

export default Iterator;
