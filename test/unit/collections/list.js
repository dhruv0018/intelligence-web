import List from '../../../src/collections/list';

/* Utility for consoling out large objects. */
const util = require('util');
const krog = obj => console.log(util.inspect(obj));

const srcArray = [
    1,
    2,
    '3',
    {foo: 4},
    null,
    undefined,
    ,
    ,
    ,
    ,
    10,
    {
        'bar': "baz"
    },
    true
];

describe('List', () => {

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
        'isEmpty'
    ];

    let sampleList;

    beforeEach(() => sampleList = new List(srcArray.slice(0)));

    it('should exist.', () => {

        expect(List).to.exist;
    });

    it('should have public API', () => {

        classMethods.forEach(method => expect(List).to.respondTo(method));
    });

    it('should have a length property', () => {

        expect(sampleList.length).to.equal(13);
    });

    it('should have an "includes" method', () => {

        /* From start of Array onwards */
        expect(sampleList.includes(1)).to.be.a('boolean');
        expect(sampleList.includes(1)).to.be.true;
        expect(sampleList.includes(999)).to.be.a('boolean');
        expect(sampleList.includes(999)).to.be.false;
        /* The following is true because there are a lot of undefined elements */
        expect(sampleList.includes()).to.be.a('boolean');
        expect(sampleList.includes()).to.be.true;

        /* From index onwards */
        expect(sampleList.includes(1, 3)).to.be.a('boolean');
        expect(sampleList.includes(1, 3)).to.be.false;
        expect(sampleList.includes(999, 3)).to.be.a('boolean');
        expect(sampleList.includes(999, 3)).to.be.false;
        /* The following is false because there are no undefined elements from
         * index 10 onwards */
        expect(sampleList.includes(undefined, 10)).to.be.a('boolean');
        expect(sampleList.includes(undefined, 10)).to.be.false;
    });

    it('should have a setter for length that allows the array to be truncated', () => {

        let controlArray = srcArray.slice(0);

        sampleList.length   = 3;
        controlArray.length = 3;

        expect(sampleList.length).to.equal(3);
        expect(JSON.stringify(sampleList.identity())).to.equal(JSON.stringify(controlArray));
    });

    it('should have a setter that does nothing if value equals the length', () => {

        let controlArray = srcArray.slice(0);

        sampleList.length = sampleList.length;
        controlArray.length = controlArray.length;
        expect(JSON.stringify(sampleList.identity())).to.equal(JSON.stringify(controlArray));
    });

    it('should have a setter that allows you to increase the length with a length value longer than the length', () => {

        let controlArray = srcArray.slice(0);

        controlArray.length = 20;
        sampleList.length = 20;
        expect(JSON.stringify(sampleList.identity())).to.equal(JSON.stringify(controlArray));
    });

    it('should throw an error if you attempt to set a length without specifying a value', () => {

        expect(() => sampleList.length = 'asdf').to.throw(Error);
    });

    it('should have an "identity" method that returns the data as a plain array', () => {

        expect(sampleList.identity()).to.be.an('array');
        expect(sampleList.identity().length).to.equal(srcArray.length);
        sampleList.identity().forEach((element, index) => {

            expect(element).to.deep.equal(srcArray[index]);
        });
    });

    it('should have a "clear" method that empties the array', () => {

        sampleList.clear();
        expect(sampleList.length).to.equal(0);
        expect(sampleList.identity()).to.deep.equal([]);
    });

    it('should have a get "get" method that returns a specific element.', () => {

        expect(sampleList.get(3)).to.deep.equal(srcArray[3]);
        expect(sampleList.get(2)).to.equal(srcArray[2]);
        expect(sampleList.get(5)).to.equal(srcArray[5]);
        expect(sampleList.get(6)).to.equal(srcArray[6]);
        expect(sampleList.get(7)).to.equal(srcArray[7]);
    });

    it('should throw an error if you attempt to get an element without specifying an index', () => {

        expect(() => sampleList.get()).to.throw(Error);
    });

    it('should have a "first" method that returns the first element in the array', () => {

        expect(sampleList.first()).to.equal(srcArray[0]);
    });

    it('should have a "last" method that returns the last element of the array', () => {

        expect(sampleList.last()).to.equal(srcArray[srcArray.length - 1]);
    });

    it('should have an "add" method that adds elements to the beginning of the array', () => {

        expect(sampleList.length).to.equal(13);

        sampleList.add(4, false);

        expect(sampleList.length).to.equal(14);
        expect(sampleList.get(0)).to.equal(4);
    });

    it('should have an "add" method that adds elements to the end of the array', () => {

        expect(sampleList.length).to.equal(13);

        sampleList.add(4);

        expect(sampleList.length).to.equal(14);
        expect(sampleList.get(13)).to.equal(4);
    });

    it('should have an "add" method that accepts an array of items to be appended to the array', () => {

        expect(sampleList.length).to.equal(13);

        sampleList.add([1000, 2000, '3000']);

        expect(sampleList.length).to.equal(16);
        expect(sampleList.get(13)).to.equal(1000);
        expect(sampleList.get(14)).to.equal(2000);
        expect(sampleList.get(15)).to.equal('3000');
    });

    it('should have an "add" method that accepts an array of items to be prepended to the array', () => {

        expect(sampleList.length).to.equal(13);

        sampleList.add([1000, 2000, '3000'], false);

        expect(sampleList.length).to.equal(16);
        expect(sampleList.get(0)).to.equal(1000);
        expect(sampleList.get(1)).to.equal(2000);
        expect(sampleList.get(2)).to.equal('3000');
    });

    it('should throw an error if you attempt to add an element without providing a value', () => {

        expect(() => sampleList.add()).to.throw(Error);
    });

    it('should have a "remove" method that removes elements from the array', () => {

        expect(sampleList.length).to.equal(13);
        sampleList.remove(1);
        expect(sampleList.length).to.equal(12);
        expect(sampleList.get(0)).to.equal(2);
        expect(sampleList.includes(1)).to.be.false;

        sampleList.remove({foo: 4});
        expect(sampleList.length).to.equal(12);
        expect(sampleList.get(0)).to.equal(2);
        expect(sampleList.get(2)).to.deep.equal({foo: 4});
        expect(sampleList.includes({foo: 4})).to.be.false;

        sampleList.remove(srcArray[3]);
        expect(sampleList.length).to.equal(11);
        expect(sampleList.get(0)).to.equal(2);
        expect(sampleList.get(2)).to.equal(null);
        expect(sampleList.includes(srcArray[3])).to.be.false
    });

    it('should not remove elements that do not exist', () => {

        let controlList = new List(srcArray);

        expect(sampleList).to.deep.equal(controlList);

        sampleList.remove('asdfasdf');

        expect(sampleList).to.deep.equal(controlList);

        sampleList.remove(999);

        expect(sampleList).to.deep.equal(controlList);
    });

    it('should throw an error if you attempt to remove an element without specifying an index', () => {

        expect(() => sampleList.remove()).to.throw(Error);
    });

    if('should let you know if the array is empty when you call "isEmpty"', () => {

        expect(sampleList.isEmpty()).to.be.a('boolean');
        expect(sampleList.isEmpty()).to.be.false;

        sampleList.clear();

        expect(sampleList.isEmpty()).to.be.a('boolean');
        expect(sampleList.isEmpty()).to.be.true;
    });

    it('should have called toJSON on a JSON.stringify call.', () => {

        sampleList.toJSON = sinon.spy();

        JSON.stringify(sampleList);

        assert(sampleList.toJSON.should.have.been.called);
    });

    it('should restore the original Array on JSON.stringify calls', () => {

        expect(JSON.stringify(sampleList)).to.equal(JSON.stringify(srcArray));
    });
});
