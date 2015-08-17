import SortedList from '../../../src/collections/sortedList';

/* Utility for consoling out large objects. */
const util = require('util');
const krog = obj => console.log(util.inspect(obj));

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
        'identity',
        'toJSON',
        'clear',
        'get',
        'first',
        'last',
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

    it('should have a backing store that is a reference to the array passed to the constructor', () => {

        expect(sampleList.data).to.deep.equal(srcArrayCopy);
    });

    it('should be sorted after instantiation.', () => {

        expect(sampleList.get(0)).to.deep.equal(srcArray[1]);
        expect(sampleList.get(1)).to.deep.equal(srcArray[0]);
        expect(sampleList.get(2)).to.deep.equal(srcArray[2]);
    });

    it('should be ascending sorted after instantiation, if descending set to false.', () => {

        let ascendingList = new SortedList(srcArray.slice(0), 'foo', false);

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
});
