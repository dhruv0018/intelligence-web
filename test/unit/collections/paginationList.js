import PaginationList from '../../../src/collections/paginationList';
import Page from '../../../src/collections/page';

let paginationList;
const PAGE_SIZE = 100;
const NUMBER_OF_ADJACENT_PAGE_BUTTONS = 2;

function createPaginationList () {

    paginationList = new PaginationList(10, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS);
}

describe(`PaginationList`, () => {

    beforeEach(createPaginationList);

    it(`should exist.`, () => {

        expect(PaginationList).to.exist;
    });

    it(`should have a public API`, () => {

        expect(PaginationList).to.respondTo('indexClamp');
    });
});

describe(`PaginationList.subset`, () => {

    beforeEach(createPaginationList);

    it(`should get the first 5 pages if current page is 1`, () => {

        expect(paginationList.subset).to.be.an.array;
        expect(paginationList.subset).to.have.length(5);
        expect(paginationList.subset).to.deep.equal([
            new Page(1, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(2, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(3, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(4, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(5, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS)
        ]);
    });

    it(`should get the middle 5 pages if current page is 5`, () => {

        let targetPage = paginationList.find(5);
        paginationList.currentPage = targetPage;

        expect(paginationList.subset).to.be.an.array;
        expect(paginationList.subset).to.have.length(5);
        expect(paginationList.subset).to.deep.equal([
            new Page(3, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(4, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(5, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(6, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(7, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS)
        ]);
    });

    it(`should get the last 5 pages if current page is 10`, () => {

        let targetPage = paginationList.find(10);
        paginationList.currentPage = targetPage;

        expect(paginationList.subset).to.be.an.array;
        expect(paginationList.subset).to.have.length(5);
        expect(paginationList.subset).to.deep.equal([
            new Page(6, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(7, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(8, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(9, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS),
            new Page(10, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS)
        ]);
    });
});

describe(`PaginationList.currentPage`, () => {

    beforeEach(createPaginationList);

    it(`should be a getter`, () => {

        expect(paginationList.currentPage)
            .to.deep.equal(new Page(1, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS));
    });

    it(`should be a setter`, () => {

        let targetPage = paginationList.find(2);
        paginationList.currentPage = targetPage;
        expect(paginationList.currentPage)
            .to.deep.equal(new Page(2, PAGE_SIZE, NUMBER_OF_ADJACENT_PAGE_BUTTONS));
    });
});

describe(`PaginationList.currentPageNumber`, () => {

    beforeEach(createPaginationList);

    it(`should be a getter`, () => {

        expect(paginationList.currentPageNumber).to.equal(1);

        let targetPage = paginationList.find(2);
        paginationList.currentPage = targetPage;

        expect(paginationList.currentPageNumber).to.equal(2);
    });
});

describe(`PaginationList.indexClamp`, () => {

    beforeEach(createPaginationList);

    it(`should return 0 if current page is 1 (array index 0)`, () => {

        expect(paginationList.indexClamp(0)).to.equal(0);
    });

    it(`should return 0 if current page less than 0`, () => {

        expect(paginationList.indexClamp(-123)).to.equal(0);
    });

    it(`should return 4 if current array index is 4`, () => {

        expect(paginationList.indexClamp(4)).to.equal(4);
    });

    it(`should return 5 if current array index is 123 (past the end of the array
        less the length of the subset to be returned)`, () => {

        // 0 1 2 3 4 5 6 7 8 9
        expect(paginationList.indexClamp(123)).to.equal(5);
    });
});
