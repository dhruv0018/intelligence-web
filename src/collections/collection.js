class Collection {

    /**
     * Constructor:
     * Enforce interface by throwing error on new
     *
     * @return: {Error} Cannot instantiate
     */
    constructor() {

        throw new Error('Cannot instantiate the Collection interface');
    }

    /**
     * Method:extend
     * Replicates a given collection
     *
     * @param: {Object} Collection to replicate
     * @return: {Object} New collection
     */
    extend(collection) {

        Object.assign(this, collection);

        return this;
    }

    get length() {}

    clear() {}

    get() {}

    add(item) {}

    remove(item) {}
}

export default Collection;
