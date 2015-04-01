import Collection from './collection.js';

class Dictionary extends Collection {

    /**
     * Constructor:
     * Instantaties Dictionary with a new map
     *
     * @param: {Map} (opt) Dictionary to copy
     * @return: {Dictionary} New dictionary
     */
    constructor(map) {

        map = map || new Map();

        this.extend(map);

        return this;
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
     * @param: {Integer} Key of value
     * @return: {Object} Value of key
     */
    get(key) {

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

        if (!key) {

            throw new Error('Invoked Dictionary.add without passing a key');
        } else if (!value) {

            throw new Error('Invoked Dictionary.add without passing a value');
        }

        return this.dictionary(key, value);
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

        return this.delete(key);
    }
}

export default Dictionary;
