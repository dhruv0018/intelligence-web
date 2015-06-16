const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

// TODO: Run Traceur in unit tests
import TranscodeProfile from '../src/entities/transcodeProfile';

describe('TranscodeProfile', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(transcodeProfile => {

        expect(transcodeProfile).to.exist;
    }));

    it('should have a public API', inject(transcodeProfile => {

        expect(transcodeProfile).to.respondTo('id');
        expect(transcodeProfile).to.respondTo('videoId');
        expect(transcodeProfile).to.respondTo('targetBitrate');
        expect(transcodeProfile).to.respondTo('maximumBitrate');
        expect(transcodeProfile).to.respondTo('minimumBitrate');
        expect(transcodeProfile).to.respondTo('targetDisplayWidth');
        expect(transcodeProfile).to.respondTo('targetDisplayHeight');
        expect(transcodeProfile).to.respondTo('aspectRatio');
        expect(TranscodeProfile).to.respondTo('title');
        expect(transcodeProfile).to.respondTo('status');
        expect(transcodeProfile).to.respondTo('url');
        expect(transcodeProfile).to.respondTo('resourceUrl');
    }));
});
