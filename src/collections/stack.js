/**
 * Creates a Stack
 * @class Stack
 * @classdesc Takes an array and implements a stack
 */
class Stack {

    /**
     * Instantaties Stack as a new array
     *
     * @constructs Stack
     * @param {Array} [array] - Array to use as stack data structure
     */
    constructor (array = []) {

        if (!Array.isArray(array)) {

            throw new Error('Stack data must be an Array!');
        }

        this.stack = array;
    }

    /**
     * Adds a new element to the stack
     *
     * @method push
     * @param {Object|Integer|Boolean}
     *
     */
    push (value) {

        if(value) {
            this.stack.push(value);
        } else {
            throw new Error('Cannot push on Stack without passing an element!');
        }
    }

    /**
     * Removes an element from the stack
     *
     * @method pop
     * @returns {Object|Integer|Boolean|undefined}
     */
    pop () {

        return this.stack.pop();
    }

    /**
     * Returns the element at the top of the stack without removing it
     *
     * @method top
     * @return: {Object|Integer|Boolean|undefined}
     * 
     */
    top () {

        if(this.stack.size) {
            return this.stack[this.stack.size - 1];
        }
    }

    /**
     * Removes all entries in the stack
     *
     * @method clear
     *
     */
    clear () {

        this.stack = [];
    }

    /**
     * Returns a copy of the stack
     *
     * @method identity
     * @returns {Array} - A copy of the stack.
     *
     */
    identity () {

        return this.stack.slice(0);
    }

    /**
     * Returns the number of elements in the stack
     *
     * @method size
     * @returns {Integer}
     *
     */
    get size () {

        return this.stack.length;
    }

    /**
     * Returns true or false depending on if the stack is empty or not
     *
     * @method empty
     * @returns {Boolean}
     *
     */
    empty () {

        return !this.stack.length;
    }

}

export default Stack;
