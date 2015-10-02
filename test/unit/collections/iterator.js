import Iterator from '../../../src/collections/iterator';

const srcArray = [
    1,
    2,
    3
];

describe('Iterator', () => {

    const classMethods = [
        'next',
        'previous',
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


    it('should be able to retrieve the previous item when it exists', () => {
        let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
        iter.current = lastItem;
        let previous = iter.previous();
        expect(previous.value).to.equal(2);
        expect(previous.done).to.be.false;
    });

    it('should be backwardly iterable', () => {
        let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
        iter.current = lastItem;
        let totalSteps = 0;
        while(iter.hasPrev()) {
            expect(iter.current.value).to.not.be.null;
            iter.previous();
            totalSteps++;
        }
        expect(totalSteps).to.equal(srcArrayCopy.length - 1);
        expect(iter.current.value).to.equal(1);
        expect(iter.current.done).to.be.false;
    });

});
