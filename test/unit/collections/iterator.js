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
        'hasPrevious'
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
        while(iter.hasPrevious()) {
            expect(iter.current.value).to.not.be.null;
            iter.previous();
            totalSteps++;
        }
        expect(totalSteps).to.equal(srcArrayCopy.length - 1);
        expect(iter.current.value).to.equal(1);
        expect(iter.current.done).to.be.false;
    });

    describe('hasNext', () => {
        it('should return false if you are on the last item', () =>{
            let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
            iter.current = lastItem;
            let hasNext = iter.hasNext();
            expect(hasNext).to.be.false;
        });

        it('should return true if there are more items to access', () => {
            let firstItem = srcArrayCopy[0];
            iter.current = firstItem;
            let hasNext = iter.hasNext();
            expect(hasNext).to.be.true;
        });

        it('should be able to take an arbitary index', ()=> {
            let hasNextFromFirst = iter.hasNext(0);
            expect(hasNextFromFirst).to.be.true;
            let hasNextFromLast = iter.hasNext(srcArrayCopy.length - 1);
            expect(hasNextFromLast).to.be.false;
        });
    });

    describe('hasPrevious', () => {
        it('should return false if you are on the first item', () =>{
            let firstItem = srcArrayCopy[0];
            iter.current = firstItem;
            let hasPrevious = iter.hasPrevious();
            expect(hasPrevious).to.be.false;
        });

        it('should return true if there are previous items to access', () => {
            let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
            iter.current = lastItem;
            let hasPrevious = iter.hasPrevious();
            expect(hasPrevious).to.be.true;
        });

        it('should be able to take an arbitary index', ()=> {
            let hasPreviousFromFirst = iter.hasPrevious(0);
            expect(hasPreviousFromFirst).to.be.false
            let hasPreviousFromLast = iter.hasPrevious(srcArrayCopy.length - 1);
            expect(hasPreviousFromLast).to.be.true;
        });
    });

    describe('readPrevious', () => {
        it("should get the previous item without advancing the state of the iterator", () =>{
            let lastItem = srcArrayCopy[srcArrayCopy.length - 1];
            iter.current = lastItem;
            let previousItem = iter.readPrevious();
            expect(previousItem.value).to.equal(2);
            expect(previousItem.done).to.be.false;
            expect(iter.current.value).to.equal(lastItem);
            expect(iter.current.done).to.be.true;
        });
    });

});
