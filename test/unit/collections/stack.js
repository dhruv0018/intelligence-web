import Stack from '../../../src/collections/stack';

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
        'clear',
        'toJSON',
        'isEmpty'
    ];

    let srcArrayCopy;
    let sampleStack;

    beforeEach(() => {
        srcArrayCopy = angular.copy(srcArray);
        sampleStack = new Stack(srcArrayCopy);
    });

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

        let data = sampleStack.list.data;

        expect(sampleStack.top()).to.equal(data[data.length - 1]);
    });

    it('should have an "push" method that adds an element to the top of the stack', () => {

        let data = sampleStack.list.data;

        expect(sampleStack.size).to.equal(13);
        sampleStack.push(4);
        expect(sampleStack.size).to.equal(14);
        expect(data[data.length - 1]).to.equal(4);
    });

    it('should have an "pop" method that removes an element to the top of the stack', () => {

        expect(sampleStack.size).to.equal(13);

        expect(sampleStack.pop()).to.equal(true);

        expect(sampleStack.size).to.equal(12);
    });


    it('should throw an error if you attempt to push an element without providing a value', () => {

        expect(() => sampleStack.push()).to.throw(Error);
    });

    it('should have a "clear" method that empties the stack', () => {

        sampleStack.clear();
        expect(sampleStack.size).to.equal(0);
        expect(sampleStack.toJSON()).to.deep.equal([]);
    });

    it('should have an "toJSON" method that returns the data as a plain array', () => {

        expect(sampleStack.toJSON()).to.be.an('array');
        expect(sampleStack.toJSON().size).to.equal(srcArrayCopy.size);
        sampleStack.toJSON().forEach((element, index) => {

            expect(element).to.deep.equal(srcArrayCopy[index]);
        });
    });

    it('should let you know if the array is empty when you call "empty"', () => {

        expect(sampleStack.isEmpty()).to.be.a('boolean');
        expect(sampleStack.isEmpty()).to.be.false;

        sampleStack.clear();

        expect(sampleStack.isEmpty()).to.be.a('boolean');
        expect(sampleStack.isEmpty()).to.be.true;
    });

});
