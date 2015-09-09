import List from './list';
/**
 * Creates a Stack
 * @class Stack
 * @classdesc Takes an array and implements a stack
 */
class Stack {

    /**
     * Instantaties Stack
     *
     * @constructs Stack
     * @param {Array} [array] - Array to use as stack data structure
     */
    constructor (array = []) {

        this.list = new List(array);
    }

    /**
     * Adds a new element to the stack
     *
     * @method push
     * @param {Object}
     *
     */
    push (value) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.add without passing an Object to add');
        }

        this.list.add(value);
    }

    /**
     * Removes an element from the stack
     *
     * @method pop
     * @returns {Object}
     */
    pop () {

        return this.list.data.pop();
    }

    /**
     * Returns the element at the top of the stack without removing it
     *
     * @method top
     * @return: {Object}
     *
     */
    top () {

        return this.list.last;
    }

    /**
     * Removes all entries in the stack
     *
     * @method clear
     *
     */
    clear () {

        return this.list.clear();
    }

    /**
     * Returns a copy of the stack
     *
     * @method toJSON
     * @returns {Array} - A copy of the stack.
     *
     */
    toJSON () {

        return this.list.toJSON();
    }

    /**
     * Returns the number of elements in the stack
     *
     * @method length
     * @returns {Integer}
     *
     */
    get length () {

        return this.list.length;
    }

    /**
     * Returns true or false depending on if the stack is empty or not
     *
     * @method isEmpty
     * @returns {Boolean}
     *
     */
    isEmpty () {

        return this.list.isEmpty();
    }

}

export default Stack;
