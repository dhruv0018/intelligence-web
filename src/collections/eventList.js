import SortedList from './sortedList';

class EventList extends SortedList {

    /**
     * Instantaties Sorted Event List as a new array
     *
     * @constructs EventList
     * @param {Array} [array]        - Array to use as backing store
     * @param {String} sortProperty  - Property to sort array by
     * @param {Boolean} [descending] - Sort array descending/ascending
     */
    constructor(array, sortProperty = 'time', descending = true) {
        super(array, sortProperty, descending);
    }
}

export default EventList;
