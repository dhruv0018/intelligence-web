import EventList from '../../../src/collections/eventList';

const srcArray = [
    {
        time: 4252.4299316406
    },
    {
        time: 3052.4299316406
    },
    {
        time: 2914.5400390625
    }
];

describe('EventList', () => {
    let srcArrayCopy;
    let sampleList;

    beforeEach(() => {

        srcArrayCopy = srcArray.slice(0);
        sampleList   = new EventList(srcArrayCopy);
    });

    it('should exist.', () => {
        expect(EventList).to.exist;
    });

    it('should be sorted by time', () => {
        let time = 0;
        for (let event of sampleList) {
            expect(event.value.time).to.be.at.least(time);
            time = event.value.time;
        }
    });

    describe('eventIterator', () => {
        it('should exist', () => {
            let iter = sampleList.eventIterator;
            expect(iter).to.not.be.null;
        });
    });

    describe('upperBoundingTime', ()=> {

        it('should return the time of the next event when there is one', () => {
            let index = 1;
            let nextIndex = index + 1;
            sampleList.eventIterator.current = sampleList.get(index);
            let upperBoundingTime = sampleList.upperBoundingTime();
            let expectedTime = sampleList.get(nextIndex).time;
            expect(upperBoundingTime).to.equal(expectedTime);
        });

        it('should return null if there is no next event', () => {
            let event = sampleList.last;
            sampleList.eventIterator.current = event;
            let upperBoundingTime = sampleList.upperBoundingTime();
            let expectedTime = null;
            expect(upperBoundingTime).to.be.null;
        });
    });

    describe('lowerBoundingTime', ()=> {

        it('should return the time of the previous event when there is one', () => {
            let index = sampleList.length - 1;
            let previousIndex = index - 1;
            sampleList.eventIterator.current = sampleList.get(index);
            let lowerBoundingTime = sampleList.lowerBoundingTime();
            let expectedTime = sampleList.get(previousIndex).time;
            expect(lowerBoundingTime).to.equal(expectedTime);
        });

        it('should return null if there is no previous event', () => {
            let event = sampleList.first;
            sampleList.eventIterator.current = event;
            let lowerBoundingTime = sampleList.lowerBoundingTime();
            let expectedTime = null;
            expect(lowerBoundingTime).to.be.null;
        });
    });

});
