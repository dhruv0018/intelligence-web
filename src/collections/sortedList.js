import List from './list';

class SortedList extends List {

    constructor (array = []) {

        super(array);
    }

    /**
     * Method:sort
     * Sorts entries by property in order
     *
     * @param: {String} (req) Property to sort by
     * @param: {Boolean} (opt) Sort by ASCENDING
     *         [false] or DESCENDING [true],
     *         default is [true]
     * @return: {Array} Sorted List
     */
    sort (property, descending = true) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoked List.sort without passing a String property to sort by');
        }

        return this.sort((a, b) => {

            return descending ? (b.property - a.property) : (a.property - b.property);
        });
    }
}
