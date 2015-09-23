import SortedList from './sortedList';

class PlayList extends SortedList {

    /**
     * Instantaties Sorted Play List as a new array
     *
     * @constructs SortedList
     * @param {Array} [array]        - Array to use as backing store
     * @param {String} sortProperty  - Property to sort array by
     * @param {Boolean} [descending] - Sort array descending/ascending
     */
    constructor(array, sortProperty = 'startTime', descending = true) {
        super(array, sortProperty, descending);
    }

    /**
     * Finds the play relative to a play passed in
     *
     * @method previous
     * @param {Play} play - play you are comparing against
     * @returns {Play |null}
     */
    previous(play) {
        let position = this.data.indexOf(play);
        let previous = this.data[position - 1];
        return previous ? previous : null;
    }

    /**
     * Finds the next play relative to a play passed in
     *
     * @method next
     * @param {Play} play - play you are comparing against
     * @returns {Play |null}
     */
    next(play) {
        let position = this.data.indexOf(play);
        let next = this.data[position + 1];
        return next ? next : null;
    }
}

export default PlayList;
