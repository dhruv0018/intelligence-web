import Iterator from '../../../src/collections/iterator';

const srcArray = [
    1,
    2,
    3
];

describe('Iterator', () => {

    const classMethods = [
        'next',
        'prev',
        'hasNext',
        'hasPrev'
    ];

    let srcArrayCopy;
    let iter;

    beforeEach(() => {

        srcArrayCopy = srcArray.slice(0);
        iter = new Iterator(srcArrayCopy);
    });

    it('should exist.', () => {

        expect(Iterator).to.exist;
    });

    it('should be forwardly iterable', () => {
        let totalSteps = 0;
        while (iter.hasNext()) {
            expect(iter.current.value).to.not.be.null;
            iter.next();
            totalSteps++;
        }
        expect(totalSteps).to.equal(srcArrayCopy.length - 1);
        expect(iter.current.value).to.equal(3);
        expect(iter.current.done).to.be.true;
    });

    it('should return null when there is no following item', () => {
        while (iter.hasNext()) {
            expect(iter.current.value).to.not.be.null;
            iter.next();
        }
        let item = iter.next();
        expect(item.value).to.be.null;
        expect(item.done).to.be.true;
    });

    it('should be able to retrieve the previous item when it exists', () => {
        let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
        iter.current = lastItem;
        let previous = iter.prev();
        expect(previous.value).to.equal(2);
        expect(previous.done).to.be.false;
    });

    it('should return null when there is no previous item', () => {
        let firstItem = srcArrayCopy[0];
        let previousItem = iter.prev();
        expect(previousItem.value).to.be.null;
        expect(previousItem.done).to.be.false;
    });

    it('should be backwardly iterable', () => {
        let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
        iter.current = lastItem;
        let totalSteps = 0;
        while(iter.hasPrev()) {
            expect(iter.current.value).to.not.be.null;
            iter.prev();
            totalSteps++;
        }
        expect(totalSteps).to.equal(srcArrayCopy.length - 1);
        expect(iter.current.value).to.equal(1);
    });

});
