import Collection from './collection.js';

class Set extends Collection {

    /**
     * Constructor:
     * Instantaties Set with a new map
     *
     * @param: {Map} (opt) Set to copy
     * @return: {Set} New set
     */
    constructor(map) {

        let self = this;

        map = map || new Map();

        self.extend(map);

        return self;
    }

    /**
     * Getter:length
     * Returns length of set
     *
     * @return: {Integer} length
     */
    get length() {

        let self = this;

        return self.size;
    }

    /**
     * Method:clear
     * Removes all entries in the set
     *
     * @return: {Set} Empty set
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
     * Adds a new entry to the set
     *
     * @param: {Object} (req) Key of entry to
     *         add to the set
     * @param: {Object} (req) Value of entry
     *         to add to the set
     * @return: {Object} Entry added
     */
    add(key, value) {

        let self = this;

        if (!key) {

            throw new Error('Invoked Set.add without passing a key');
        } else if (!value) {

            throw new Error('Invoked Set.add without passing a value');
        }

        return self.set(key, value);
    }

    /**
     * Method:remove
     * Removes an entry from the set
     *
     * @param: {Object} (req) Key of entry
     *         to remove from the set
     * @return: {Boolean} Success
     */
    remove(key) {

        let self = this;

        return self.delete(key);
    }
}

export default Set;
