import SortedList from './sortedList';

class EventList extends SortedList {

    /**
     * Instantaties Sorted Event List as a new array
     *
     * @constructs EventList
     * @param {Array} [array]        - Array to use as backing store
     * @param {String} [sortProperty]  - Property to sort array by
     * @param {Boolean} [descending] - Sort array descending/ascending
     */
    constructor(array, sortProperty = 'time', descending = true) {
        super(array, sortProperty, descending);

        //persistant state tracking iterator
        this.statefulIterator = this.iterator();
    }

    /**
     * Returns the event time of the following event or null if there is no following event
     *
     * @method upperBoundingTime
     * @returns {Integer | null}
     */
    upperBoundingTime() {
        let current = this.statefulIterator.current.value;
        let next = this.statefulIterator.readNext().value;
        let time = null;
        if (next && next.time) {
            time = next.time;
        }
        return time;
    }

    /**
     * Returns the event time of the preceeding event or null if there is no preceeding event
     *
     * @method lowerBoundingTime
     * @returns {Integer | null}
     */
    lowerBoundingTime() {
        let current = this.statefulIterator.current.value;
        let previous = this.statefulIterator.readPrevious().value;
        let time = null;
        if (previous && previous.time) {
            time = previous.time;
        }
        return time;
    }

    /**
     * Returns the internal iterator
     *
     * @method eventIterator
     * @returns {Iterator}
     */
    get eventIterator() {
        return this.statefulIterator;
    }
}

export default EventList;
