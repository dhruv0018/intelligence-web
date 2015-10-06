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
        this.eventIterator = this.iterator();
    }

    // upperBoundingTime(event = this.current) {
    //     let next = this.next(event, false);
    //     console.log(next);
    // }

    get current(){
        return this.eventIterator.current.value;
    }

    set current(event) {
        this.eventIterator.current = event;
    }

    /**
     * Returns the next event relative to either the current event or an arbitrary event.
     *
     * @method next
     * @param {Event} [event] - the event which you want to find out what follows (defaulted to current event)
     * @param {Boolean} [advanceState] - determines if the list should advance the internal list iterator or use a disposable iterator
     * @returns {Object}
     */
    next(event = this.current, advanceState = true) {
        let iterator = advanceState ? this.eventIterator : this.iterator();
        iterator.current = event;
        return iterator.next().value;
    }
}

export default EventList;
