/**
 * Creates a Iterator
 * @class Iterator
 * @classdesc Takes an array as a backing store and abstracts state tracking
 */
class Iterator {
    /**
     * Instantiates Iterator for array based datastructures
     *
     * @constructs Iterator
     * @param {Array} [backingStore] - Array to use as backing data store
     */
    constructor(backingStore) {
        this.index = 0;
        this.backingStore = backingStore;
    }

    /**
     * Returns the next item in the backingStore and advances the index position.
     *
     * @method next
     * @returns {Object}
     */
    next() {
        this.index++;
        return this.current;
    }

    /**
     * Returns the previous item in the backingStore and moves the index backwards.
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
        let value = this.backingStore[this.index] || null;
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
        this.index = this.backingStore.indexOf(item);
    }

    /**
     * Returns if there is another item after the current item
     *
     * @method hasNext
     * @returns {Boolean}
     */
    hasNext() {
        return this.index + 1 < this.backingStore.length;
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
