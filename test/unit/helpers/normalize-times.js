const moment = require('moment');

/* Make sure Date objects match; there may be a slight milliseconds
 * difference when creating shares in the Game Factory and creating
 * test data to test against. */

function normalizeTimes (collection, dateProperty) {

    Object.keys(collection)
        .forEach(key => {

            let share = collection[key];
            if (share[dateProperty]) {

                share[dateProperty] = moment.utc(share[dateProperty])
                    .milliseconds(0)
                    .seconds(0)
                    .toDate();
            }
        });

    return collection;
}

export default normalizeTimes;
