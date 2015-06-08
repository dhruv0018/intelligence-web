
class Entity {

    constructor (entity) {

        this.extend(entity);
    }

    extend (entity) {

        let describedEntity = Object.keys(entity).reduce((propertyDescriptor, propertyName) => {

            propertyDescriptor[propertyName] = Object.getOwnPropertyDescriptor(entity, propertyName);

            return propertyDescriptor;
        }, {});

        Object.defineProperties(this, describedEntity);

        return this;
    }
}

export default Entity;
