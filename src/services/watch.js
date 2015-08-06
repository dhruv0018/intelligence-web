/* Import Angular IntelligenceWebClient module */
const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

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

    constructor (object, propertyName, callback) {

        return Object.observe(object, changes => {

            const change = changes.shift();

            if (
                change.name === propertyName &&
                change.type === 'update'
            ) {

                const oldValue = change.oldValue;
                const newValue = object[propertyName];

                callback(oldValue, newValue);
            }
        });
    }
}

/* Open Watch service to Angular DI */
IntelligenceWebClient.service('Watch', Watch);

/* Export Watch class for ES6 modules */
export default Watch;
