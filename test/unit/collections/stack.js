import Stack from '../../../src/collections/stack';

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

describe('Stack', () => {

    const classMethods = [
        'push',
        'pop',
        'top',
        'size',
        'empty'
    ];

    let sampleStack;

    beforeEach(() => sampleStack = new Stack(srcArray.slice(0)));

    it('should exist.', () => {

        expect(Stack).to.exist;
    });

    it('should have public API', () => {

        classMethods.forEach(method => expect(Stack).to.respondTo(method));
    });

    it('should have a size property', () => {

        expect(sampleStack.size).to.equal(13);
    });

    it('should have a "top" method that returns the object at the top of the stack without removing it.', () => {

        expect(sampleStack.top()).to.equal(srcArray[srcArray.size - 1]);
    });

    it('should have an "push" method that adds an element to the top of the stack', () => {

        expect(sampleStack.size).to.equal(13);

        sampleStack.push(4);

        expect(sampleStack.size).to.equal(14);
    });

    it('should have an "pop" method that removes an element to the top of the stack', () => {

        expect(sampleStack.size).to.equal(13);

        expect(sampleStack.pop()).to.equal(true);
    });


    it('should throw an error if you attempt to push an element without providing a value', () => {

        expect(() => sampleStack.push()).to.throw(Error);
    });


    it('should let you know if the array is empty when you call "empty"', () => {

        expect(sampleStack.empty()).to.be.a('boolean');
        expect(sampleStack.empty()).to.be.false;

        sampleStack = [];

        expect(sampleStack.empty()).to.be.a('boolean');
        expect(sampleStack.empty()).to.be.true;
    });

});
