/**
 * Object property watch service backed by Object.observe
 * @module Watch
 * @name Watch
 * @type {Service}
 * @example
 * const watch = new Watch(foo, 'bar', (oldValue, newValue) => {
 *
 *     console.log(oldValue, newValue);
 * });
 */
class Watch {

    constructor (obj, propertyName, callback) {

        return Object.observe(obj, changes => {

            const change = changes.shift();

            if (
                change.name === propertyName &&
                change.type === 'update'
            ) {

                const oldValue = change.oldValue;
                const newValue = obj[propertyName];

                callback(oldValue, newValue);
            }
        });
    }
}

export default Watch;
