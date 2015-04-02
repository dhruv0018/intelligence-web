import Collection from './collection.js';

class Dictionary extends Collection {

    /**
     * Constructor:
     * Instantaties Dictionary with a new map
     *
     * @param: {Map} (opt) Dictionary to copy
     * @return: {Dictionary} New dictionary
     */
    constructor(map = new Map()) {

        this.extend(map);
    }

    /**
     * Getter:length
     * Returns length of dictionary
     *
     * @return: {Integer} length
     */
    get length() {

        return this.size;
    }

    /**
     * Method:clear
     * Removes all entries in the dictionary
     *
     * @return: {Dictionary} Empty dictionary
     */
    clear() {

        return this.clear();
    }

    /**
     * Method:get
     * Return value of key
     *
     * @param: {Integer} (req) Key of value
     * @return: {Object} Value of key
     */
    get(key) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked Dictionary.get without passing a key');
        }

        return this.get(key);
    }

    /**
     * Method:add
     * Adds a new entry to the dictionary
     *
     * @param: {Object} (req) Key of entry to
     *         add to the dictionary
     * @param: {Object} (req) Value of entry
     *         to add to the dictionary
     * @return: {Object} Entry added
     */
    add(key, value) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked Dictionary.add without passing a key');

            case 1:

                throw new Error('Invoked Dictionary.add without passing a value');
        }

        return this.set(key, value);
    }

    /**
     * Method:remove
     * Removes an entry from the dictionary
     *
     * @param: {Object} (req) Key of entry
     *         to remove from the dictionary
     * @return: {Boolean} Success
     */
    remove(key) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked Dictionary.remove without passing a key');
        }

        return this.delete(key);
    }
}

export default Dictionary;
