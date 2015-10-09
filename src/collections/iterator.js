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
        if (!Array.isArray(data)) {
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
        if (this.hasNext()) this.index++;
        return this.current;
    }

    /**
     * Returns the previous item in the data and moves the index backwards.
     *
     * @method previous
     * @returns {Object}
     */
    previous() {
        if (this.hasPrevious()) this.index--;
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
     * Setter for the current item
     * @param {Object} item    - item which new index will be based on
     */
    set current(item) {
        let index = this.data.indexOf(item);
        if (index < 0) {
            console.error('you are attempting to set an item which does not exist in the array');
        } else {
            this.index = index;
        }
    }

    /**
     * Returns if there is another item after the current item
     *
     * @method hasNext
     * @returns {Boolean}
     */
    hasNext(index = this.index) {
        return index + 1 < this.data.length;
    }

    /**
     * Returns if there is another item before the current item
     *
     * @method hasPrevious
     * @param index
     * @returns {Boolean}
     */
    hasPrevious(index = this.index) {
        return index > 0;
    }

    /**
     * Returns previous item without changing the iterator
     *
     * @method readPrevious
     * @returns {Object}
     */
    readPrevious() {
        let index = this.index - 1;
        return {
            value: this.data[index] || null,
            done: !this.hasNext(index)
        };
    }

    /**
     * Returns next item without changing the iterator
     *
     * @method readNext
     * @returns {Object}
     */
    readNext() {
        let index = this.index + 1;
        return {
            value: this.data[index] || null,
            done: !this.hasNext(index)
        };
    }

}

export default Iterator;
