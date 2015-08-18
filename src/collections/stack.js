/**
 * Creates a Stack
 * @class Stack
 * @classdesc Takes an array and implements a stack
 */
class Stack {

    /**
     * Constructor:
     * Instantaties Stack as a new array
     *
     * @param: {Array} (opt) Array to copy
     */
    constructor (array = []) {

        if (!Array.isArray(array)) {

            throw new Error('Stack data must be an Array!');
        }

        this.stack = array;
    }

    // /**
    //  * This is a foo method
    //  *
    //  * @method Class.methodName
    //  * @param {Object} myParameter
    //  * @returns {Boolean} flag
    //  */
    /**
     * Method:push
     * Pushes element to the top of the stack
     *
     * @return: null
     */
    push (value) {

        if(value) {
            this.stack.push(value);
        } else {
            throw new Error('Cannot push on Stack without passing an element!');
        }
    }

    /**
     * Method:pop
     * Returns element at the top of the stack
     *
     * @return: {Object} [true] if stack has elements, else null
     */
    pop () {

        return this.stack.pop();
    }

    /**
     * Method:top
     * Returns the element at the top of the stack
     *
     * @return: {Object} [true] if stack has elements, else null
     */
    top () {

        if(this.stack.size) {
            return this.stack[this.stack.size - 1];
        }
    }

    /**
     * Removes all entries in the list
     *
     * @method clear
     * @returns {Stack} - The array that was cleared
     */
    clear () {

        this.stack = [];
    }

    /**
     * Returns a copy of the array, and only the array
     *
     * @method identity
     * @returns {Array} - A copy of the data backing store.
     */
    identity () {

        return this.stack.slice(0);
    }

    /**
     * Method:size
     * Returns the number of elements in the stack
     *
     * @return: {Integer}
     */
    get size () {

        return this.stack.length;
    }

    /**
     * Method:empty
     * Returns empty Stack status
     *
     * @return: {Boolean} [true] if empty, else [false]
     */
    empty () {

        return !this.stack.length;
    }

}

export default Stack;
