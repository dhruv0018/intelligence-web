class Value {

    constructor (value) {
        this.extend(value);
    }

    extend (value) {

        Object.assign(this, value);

        return this;
    }
}

export default Value;
