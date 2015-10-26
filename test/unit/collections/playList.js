import PlayList from '../../../src/collections/playList';

const srcArray = [
    {
        startTime: 3052.4299316406,
        events: [
            {
                time: 3054.4299316406
            },
            {
                time: 3055.4299316406
            }
        ]
    },
    {
        startTime: 2914.5400390625,
        events: [
            {
                time: 2915.5400390625
            },
            {
                time: 2916.5400390625
            }
        ]
    },
    {
        startTime: 4242.2311313121,
        events: [
            {
                time: 4243.2311313121
            },
            {
                time: 4244.2311313121
            }
        ]
    }
];

describe('PlayList', () => {
    let srcArrayCopy;
    let sampleList;

    beforeEach(() => {

        srcArrayCopy = srcArray.slice(0);
        sampleList   = new PlayList(srcArrayCopy);
    });

    it('should exist.', () => {
        expect(PlayList).to.exist;
    });

    it('should be sorted by startTime', () => {
        let startTime = 0;
        for(let play of sampleList) {
            expect(play.value.startTime).to.be.at.least(startTime);
            startTime = play.value.startTime;
        }
    });

    describe('lowerBoundingTime', ()=> {

        it('should return the time of the previous plays first event time when there is one', () => {
            let index = sampleList.length - 1;
            let previousIndex = index - 1;
            sampleList.playIterator.current = sampleList.get(index);
            let lowerBoundingTime = sampleList.lowerBoundingTime;
            let expectedTime = sampleList.get(previousIndex).events[0].time;
            expect(lowerBoundingTime).to.equal(expectedTime);
        });

        it('should return null if there is no previous play', () => {
            let play = sampleList.first;
            sampleList.playIterator.current = play;
            let lowerBoundingTime = sampleList.lowerBoundingTime;
            expect(lowerBoundingTime).to.be.null;
        });
    });
});
