const moment = require('moment');

/* Make sure Date objects match; there may be a slight milliseconds
 * difference when creating Dates in testable code and creating
 * test data to test against. */

function setSecondsToZero (dateObject) {

    return moment.utc(dateObject)
        .milliseconds(0)
        .seconds(0)
        .toDate();
}

function normalizeTimes (collection) {

    Object.keys(collection)
        .forEach(key => {

            let item = collection[key];

            Object.getOwnPropertyNames(item)
                .forEach(property => {

                    if (item[property] instanceof Date) {

                        item[property] = setSecondsToZero(item[property]);
                    }
                });
        });

    return collection;
}

export default normalizeTimes;
