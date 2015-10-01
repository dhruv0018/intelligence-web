import PlayList from '../../../src/collections/playList';

const srcArray = [
    {
        startTime: 3052.4299316406
    },
    {
        startTime: 2914.5400390625
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
        let index = 0;
        let startTime = 0;
        for(let play of sampleList) {
            expect(play.value.startTime).to.be.at.least(startTime);
            startTime = play.value.startTime;
        }
    });
});
