class Collection {

    constructor() {

        throw new Error('Cannot instantiate the Collection interface');
    }

    extend(collection) {

        Object.assign(this, collection);

        return this;
    }

    get length() {}

    clear() {}

    add(item) {}

    remove(item) {}

    sort(property) {}
}

export default Collection;
