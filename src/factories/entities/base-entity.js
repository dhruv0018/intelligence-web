
/* Base Entity Class */

function BaseEntity() {

    this.unextend = function unextend(entity) {

        var self = this;

        entity = entity || self;

        var copy = [];

        Object.keys(entity).forEach(function assignCopies(key) {

            if (entity[key].unextend) copy.push(entity[key].unextend());
            else if (typeof entity[key] !== 'function') copy.push(angular.copy(entity[key]));

        });

        return copy;
    };

}

module.exports = function extendEntity(entity) {

    if (!entity) throw Error('extendEntity requires \'entity\' parameter');

    BaseEntity.call(entity);
};
