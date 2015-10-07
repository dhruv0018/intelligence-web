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
        this.eventIterator = this.iterator();
    }

    /**
     * Returns the event time of the following event or null if there is no following event
     *
     * @method upperBoundingTime
     * @returns {Integer || null}
     */
    upperBoundingTime(event = this.current) {
        let next = this.next(event, false);
        return next.time === event.time ? null : next.time;
    }

    /**
     * Returns the event time of the preceeding event or null if there is no preceeding event
     *
     * @method lowerBoundingTime
     * @returns {Integer || null}
     */
    lowerBoundingTime(event = this.current) {
        let previous = this.previous(event, false);
        return previous.time === event.time ? null : previous.time;
    }

    /**
     * Get the current event from the internal iterator
     *
     * @method current
     * @returns {Event}
     */
    get current(){
        return this.eventIterator.current.value;
    }

    /**
     * Sets the current event in the internal iterator
     *
     * @method current
     * @returns {Event}
     */
    set current(event) {
        this.eventIterator.current = event;
    }

    /**
     * Returns the next event relative to either the current event or an arbitrary event.
     *
     * @method next
     * @param {Event} [event] - the event which you want to find out what follows (defaulted to current event)
     * @param {Boolean} [advanceState] - determines if the list should advance the internal list iterator or use a disposable iterator
     * @returns {Event}
     */
    next(event = this.current, advanceState = true) {
        let iterator = advanceState ? this.eventIterator : this.iterator();
        iterator.current = event;
        return iterator.next().value;
    }

    /**
     * Returns the previous event relative to either the current event or an arbitrary event.
     *
     * @method previous
     * @param {Event} [event] - the event which you want to find out what follows (defaulted to current event)
     * @param {Boolean} [advanceState] - determines if the list should advance the internal list iterator or use a disposable iterator
     * @returns {Event}
     */
    previous(event = this.current, advanceState = true) {
        let iterator = advanceState ? this.eventIterator : this.iterator();
        iterator.current = event;
        return iterator.previous().value;
    }
}

export default EventList;
