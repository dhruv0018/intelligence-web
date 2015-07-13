import List from './list';

class SortedList extends List {

    /**
     * Constructor:
     * Instantaties Sorted List as a new array
     *
     * @param: {Array} (opt) Array to copy
     * @param: {String} Property to sort array by
     * @param: {Boolean} (opt) Sort array descending/ascending
     */
    constructor (array, sortProperty, descending = true) {

        super(array);

        if (!sortProperty) {

            throw new Error('Invoked List.constructor without passing a sort property');
        }

        this.sortProperty = sortProperty;
        this.descending   = descending;

        this.sortList();
    }

    /**
     * Method: sort
     * Sorts entries by property in order
     *
     * @return: {Array} Sorted List
     */
    sortList () {

        /* Create a temporary Array to sort with */
        return this.sort((a, b) => {

            if (a[this.sortProperty] > b[this.sortProperty]) {

                return this.descending? 1 : -1;
            } else if (a[this.sortProperty] < b[this.sortProperty]) {

                return this.descending? -1 : 1;
            }

            /* a must be equal to b */
            return 0;
        });
    }

    /**
     * Method: add
     * Adds new items to the array and then sorts according the sort settings
     *
     * @param: {Object} (req) Item(s) to add,
     *         (arrays accepted)
     * @return: {Array} Sorted List
     */
    add (item) {

        super.add(item);

        return this.sortList();
    }
}

export default SortedList;
