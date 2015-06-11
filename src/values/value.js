class Value {

    constructor (value) {

    }

    extend (value) {

        Object.assign(this, value);

        return this;
    }
}

export default Value;
