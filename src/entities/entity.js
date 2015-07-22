/**
 * Entity Model
 * @class Entity
 */
class Entity {

    /**
     * @constructs Entity
     * @param {Object} entity - JSON from server
     */
    constructor (entity) {

        Object.assign(this, entity);
    }
}

export default Entity;
