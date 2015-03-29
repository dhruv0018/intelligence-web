
class Entity {

    constructor (entity) {

        this.extend(entity);
    }

    extend (entity) {

        Object.assign(this, entity);

        return this;
    }
}

export default Entity;
