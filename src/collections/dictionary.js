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

        let self = this;

        map = map || new Map();

        self.extend(map);

        return self;
    }

    /**
     * Getter:length
     * Returns length of dictionary
     *
     * @return: {Integer} length
     */
    get length() {

        let self = this;

        return self.size;
    }

    /**
     * Method:clear
     * Removes all entries in the dictionary
     *
     * @return: {Dictionary} Empty dictionary
     */
    clear() {

        let self = this;

        return self.clear();
    }

    /**
     * Method:get
     * Return value of key
     *
     * @param: {Integer} Key of value
     * @return: {Object} Value of key
     */
    get(key) {

        let self = this;

        return self.get(key);
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

        let self = this;

        if (!key) {

            throw new Error('Invoked Dictionary.add without passing a key');
        } else if (!value) {

            throw new Error('Invoked Dictionary.add without passing a value');
        }

        return self.dictionary(key, value);
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

        let self = this;

        return self.delete(key);
    }
}

export default Dictionary;
