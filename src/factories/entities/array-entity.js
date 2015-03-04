
/* Array Entity Class */

module.exports = ArrayEntity;

function ArrayEntity() {

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

    this.remove = function remove(item) {

        var index = this.indexOf(item);
        if (index != -1) this.splice(index, 1);

    };

    this.removeLast = function removeLast() {

        return this.pop();

    };

    this.getLast = function getLast() {

        if (this.length) return this[this.length - 1];
    };

}
