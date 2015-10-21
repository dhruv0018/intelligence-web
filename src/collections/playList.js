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

        //persistant state tracking iterator
        this.statefulIterator = this.iterator();
    }
    /**
     * Returns the start time of the preceeding play or null if there is no preceeding play
     *
     * @type {Number | null}
     */
    get lowerBoundingTime() {
        let current = this.statefulIterator.current.value;
        let previous = this.statefulIterator.readPrevious().value;
        let time = null;
        if (previous && previous.startTime) {
            time = previous.startTime;
        }
        return time;
    }

    /**
     * Returns the internal iterator
     *
     * @method playIterator
     * @returns {Iterator}
     */
    get playIterator() {
        return this.statefulIterator;
    }
}

export default PlayList;
