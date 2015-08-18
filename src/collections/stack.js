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

        this.stack.push(value);
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

        if(this.stack.length) {
            return this.stack[this.stack.length - 1];
        }
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

        return !!this.stack.length;
    }

}

export default Stack;
