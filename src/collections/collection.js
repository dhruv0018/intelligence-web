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

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked Collection.extend without passing a Collection to extend');
        }

        Object.assign(this, collection);

        return this;
    }

    get length() {}

    clear() {}

    get(identifier) {}

    add(item) {}

    remove(item) {}

    isEmpty() {}
}

export default Collection;
