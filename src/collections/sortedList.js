import List from './list';

class SortedList extends List {

    constructor (array, sortProperty, descending) {

        super(array);

        if (!sortProperty) {

            throw new Error('Invoked List.constructor without passing a sort property');
        }

        this.sortProperty = sortProperty;
        this.descending   = descending;

        this.sortList();
    }

    /**
     * Method:sort
     * Sorts entries by property in order
     *
     * @return: {Array} Sorted List
     */
    sortList () {

        /* Create a temporary Array to sort with */
        return this.sort((a, b) => {

            if (a[this.sortProperty] > b[this.sortProperty]) {

                return 1;
            } else if (a[this.sortProperty] < b[this.sortProperty]) {

                return -1;
            }

            /* a must be equal to b */
            return 0;
        });
    }

    add (item, toLast = true) {

        super.add(item, toLast);

        this.sortList();
    }
}

export default SortedList;
