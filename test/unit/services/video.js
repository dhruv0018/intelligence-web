const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

// TODO: Run Traceur in unit tests
import Video from '../src/entities/video';

describe('Video', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(video => {

        expect(video).to.exist;
    }));

    it('should have a public API', inject(video => {

        expect(video).to.respondTo('id');
        expect(video).to.respondTo('guid');
        expect(video).to.respondTo('status');
        expect(video).to.respondTo('transcodeProfiles');
        expect(video).to.respondTo('duration');
        expect(video).to.respondTo('thumbnail');
        expect(video).to.respondTo('resourceUrls');
    }));
});
