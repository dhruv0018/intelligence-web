import SortedList from '../../../src/collections/sortedList';

const srcArray = [
    {
        foo: 'def',
        bar: true,
        baz: [7, 8, 9],
        qux: 1
    },
    {
        foo: 'abc',
        bar: true,
        baz: [4, 5, 6],
        qux: 3
    },
    {
        foo: 'ghi',
        bar: false,
        baz: [1, 2, 3],
        qux: 2
    }
];

const srcElem1 = {
    foo: 'xyz',
    bar: false,
    baz: [100, 101, 102],
    qux: 999
}

describe('SortedList', () => {

    const classMethods = [
        'includes',
        'toJSON',
        'clear',
        'get',
        'add',
        'remove',
        'isEmpty',
        'sort'
    ];

    let srcArrayCopy;
    let sampleList;

    beforeEach(() => {

        srcArrayCopy = srcArray.slice(0);
        sampleList   = new SortedList(srcArrayCopy, 'foo');
    });

    it('should exist.', () => {

        expect(SortedList).to.exist;
    });

    it('should have public API', () => {

        classMethods.forEach(method => expect(SortedList).to.respondTo(method));
    });

    it('should throw an error if you attempt to instantiate with an non-array', () => {

        expect(() => new SortedList(true)).to.throw(Error);
        expect(() => new SortedList(false)).to.throw(Error);
        expect(() => new SortedList({foo: 5}, 'foo')).to.throw(Error);
        expect(() => new SortedList(5, 'foo')).to.throw(Error);
        expect(() => new SortedList('five', 'foo')).to.throw(Error);
    });

    it('should throw an error if you attempt to instantiate without a sort property', () => {

        expect(() => new SortedList([])).to.throw(Error);
        expect(() => new SortedList(srcArrayCopy)).to.throw(Error);
    });

    it('should have a backing store that is a reference to the array passed to the constructor', () => {

        expect(sampleList.data).to.deep.equal(srcArrayCopy);
    });

    it('should be sorted after instantiation.', () => {

        expect(sampleList.get(0)).to.deep.equal(srcArray[1]);
        expect(sampleList.get(1)).to.deep.equal(srcArray[0]);
        expect(sampleList.get(2)).to.deep.equal(srcArray[2]);
    });

    it('should be ascending sorted after instantiation, if descending set to false.', () => {

        let ascendingList = new SortedList(srcArrayCopy, 'foo', false);

        expect(ascendingList.get(0)).to.deep.equal(srcArray[2]);
        expect(ascendingList.get(1)).to.deep.equal(srcArray[0]);
        expect(ascendingList.get(2)).to.deep.equal(srcArray[1]);
    });

    it('should sort itself after adding new elements', () => {

        const sampleElem = angular.copy(srcElem1);

        sampleList.add(sampleElem);

        expect(sampleList.get(0)).to.deep.equal(srcArray[1]);
        expect(sampleList.get(1)).to.deep.equal(srcArray[0]);
        expect(sampleList.get(2)).to.deep.equal(srcArray[2]);
        expect(sampleList.get(3)).to.deep.equal(sampleElem);
    });

    it('should be able to access elements in sequential order for numerically sorted lists', () => {
        sampleList   = new SortedList(srcArrayCopy, 'qux');
        let firstItem = sampleList.first;
        let previousItem = firstItem;
        while (sampleList.next()) {
            let item = sampleList.current;
            expect(item.qux).to.be.at.least(previousItem.qux);
            previousItem = sampleList.current;
        }
    });

    it('should be able to access elements in reverse sequential order for numerically sorted lists', () => {
        sampleList   = new SortedList(srcArrayCopy, 'qux');
        let lastItem = sampleList.last;
        let previousItem = lastItem;
        while (sampleList.previous()) {
            let item = sampleList.current;
            expect(item.qux).to.be.at.most(previousItem.qux);
            previousItem = sampleList.current;
        }
    });
});
