import Collection from './collection.js';

class List extends Collection {

    /**
     * Constructor:
     * Instantaties List with a new array
     *
     * @param: {Array} (opt) List to copy
     * @return: {List} New list
     */
    construction(array) {

        let self = this;

        array = array || [];

        self.extend(array);

        return self;
    }

    /**
     * Getter:length
     * Returns length of list
     *
     * @return: {Integer} length
     */
    get length() {

        let self = this;

        return self.length;
    }

    /**
     * Method:clear
     * Removes all entries in the list
     *
     * @return {List} Empty list
     */
    clear() {

        let self = this;

        return self.slice();
    }

    /**
     * Method:add
     * Adds a new entry to the list
     *
     * @param: {Object} (req) Item(s) to add,
     *         (arrays accepted)
     * @param: {Boolean} (opt) Add to FRONT
     *         [true] or BACK [false] of
     *         List, default is [false]
     * @return: {Integer} Length
     */
    add(item, location) {

        let self = this;

        if (!item) {

            throw new Error('Invoked List.add without passing an Object to add');
        } else {

            location = location || false;
        }

        return (location ? self.unshift(item) : self.push(item));
    }

    /**
     * Method:remove
     * Removes an entry from the list
     *
     * @param: {Object} (req) Item to
     *         remove (arrays not accepted)
     * @return: {Integer} Length
     */
    remove(item) {

        let self = this;
        let index = self.indexOf(item);

        if (index < 0) {

            return -1;
        } else {

            return self.splice(index, 1);
        }
    }

    /**
     * Method:sort
     * Sorts entries by property in order
     *
     * @param: {String} (req) Property to sort by
     * @param: {Boolean} (opt) Sort by ASCENDING
     *         [true] or DESCENDING [false],
     *         default is [false]
     * @return: {Array} Sorted List
     */
    sort(property, order) {

        let self = this;

        if (!property) {

            throw new Error('Invoked List.sort without passing a String property to sort by');
        } else {

            order = order || false;
        }

        return self.sort((a, b) => {

            if (order) {

                return (a[property] > b[property]) ? 1 : -1;
            } else {

                return (a[property] < b[property]) ? 1 : -1;
            }
        });
    }
}

export default List;
