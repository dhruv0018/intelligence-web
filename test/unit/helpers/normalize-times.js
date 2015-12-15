const moment = require('moment');

/* Make sure Date objects match; there may be a slight milliseconds
 * difference when creating shares in the Game Factory and creating
 * test data to test against. */

function setSecondsToZero (dateObject) {

    return moment.utc(dateObject)
        .milliseconds(0)
        .seconds(0)
        .toDate();
}

function normalizeTimes (collection, dateProperties) {

    if (!Array.isArray(dateProperties)) {

        dateProperties = [dateProperties];
    }

    Object.keys(collection)
        .forEach(key => {

            let share = collection[key];

            dateProperties.forEach(property => {

                if (share[property]) {

                    share[property] = setSecondsToZero(share[property]);
                }
            });
        });

    return collection;
}

export default normalizeTimes;
