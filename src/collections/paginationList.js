// TODO: Write unit tests

import Page from './page';
import SortedList from './sortedList';

class PaginationList extends SortedList {

    constructor (totalPages, numberOfAdjacentPageButtons) {

        let pages = [];
        let sortProperty = 'number';

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {

            pages.push(new Page(pageNumber));
        }

        super(pages, sortProperty);

        this.totalPages = totalPages;
        this.numberOfAdjacentPageButtons = numberOfAdjacentPageButtons;
        this.subsetSize = numberOfAdjacentPageButtons * 2 + 1;
        this.statefulIterator = this.iterator();
    }

    get subset () {

        let indexWithAdjacentPages = this.currentPageNumber - this.numberOfAdjacentPageButtons;
        let start = this.indexClamp(indexWithAdjacentPages) - 1;

        console.log('start', start);

        return this.identity.slice(start, start + this.subsetSize);
    }

    indexClamp (value) {

        let min = 1;
        let max = this.length - this.subsetSize + 1;

        if (value < min) return min;
        else if (value > max) return max;
        else return value;
    }

    get currentPage () {

        return this.statefulIterator.current.value;
    }

    set currentPage (newCurrent) {

        this.statefulIterator.current = newCurrent;
    }

    get currentPageNumber () {

        return this.statefulIterator.current.value.number;
    }
}

export default PaginationList;
