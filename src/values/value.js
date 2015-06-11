class Value {

    constructor (value) {

    }

    extend (entity) {

        Object.assign(this, entity);

        return this;
    }
}

export default Value;
