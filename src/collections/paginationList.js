import Page from './page';
import SortedList from './sortedList';

class PaginationList extends SortedList {

    constructor (totalPages, pageSize, numberOfAdjacentPageButtons) {

        let pages = [];
        let sortProperty = 'number';

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {

            pages.push(new Page(pageNumber, pageSize));
        }

        super(pages, sortProperty);

        this.totalPages = totalPages;
        this.numberOfAdjacentPageButtons = numberOfAdjacentPageButtons;
        this.subsetSize = numberOfAdjacentPageButtons * 2 + 1;
        this.statefulIterator = this.iterator();
    }

    get subset () {

        let start = this.currentPageNumber - this.numberOfAdjacentPageButtons;
        start = this.indexClamp(start - 1);

        return this.identity.slice(start, start + this.subsetSize);
    }

    indexClamp (value) {

        let min = 0;
        let max = this.length - this.subsetSize;

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
