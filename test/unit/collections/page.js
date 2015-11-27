import Page from '../../../src/collections/page';

describe('Page', () => {

    let page;

    beforeEach(() => {

        page = new Page(10, 100);
    });

    it('should exist.', () => {

        expect(Page).to.exist;
    });

    it('should have a `size` property.', () => {

        expect(page).to.contain.keys('size');
        expect(page.size).to.equal(100);
    });

    it('should have a `number` property.', () => {

        expect(page).to.contain.keys('number');
        expect(page.number).to.equal(10);
    });

    it('should have a `queryStart` getter', () => {

        expect(page.queryStart).to.be.a.number;
        expect(page.queryStart).to.equal(900);
    });
});
