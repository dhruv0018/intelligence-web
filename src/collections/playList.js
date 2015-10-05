import SortedList from './sortedList';

class PlayList extends SortedList {

    /**
     * Instantaties Sorted Play List as a new array
     *
     * @constructs PlayList
     * @param {Array} [array]        - Array to use as backing store
     * @param {String} [sortProperty]  - Property to sort array by
     * @param {Boolean} [descending] - Sort array descending/ascending
     */
    constructor(array, sortProperty = 'startTime', descending = true) {
        super(array, sortProperty, descending);
    }
}

export default PlayList;
