const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

import TranscodeProfile from '../src/entities/transcodeProfile';

describe('TranscodeProfile', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    const transcodeProfileJSONObject = {
        "id": 1544085,
        "videoId": 354704,
        "transcodeProfile": {
            "id": 1,
            "targetBitrate": 600,
            "maximumBitrate": 800,
            "minimumBitrate": 0,
            "description": "SD Low Resolution (360p)",
            "targetDisplayWidth": 640,
            "targetDisplayHeight": 360,
            "aspectRatio": "16:9"
        },
        "status": 4,
        "videoUrl": "http:\\/\\/krossover-com-prod-content.cdn.krossover.com\\/videos\\/finished\\/ec2-23-20-153-60.compute-1.amazonaws.com544e904aa6998_600.mp4"
    };

    const transcodeProfile = new TranscodeProfile(transcodeProfileJSONObject);

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
        expect(transcodeProfile).to.respondTo('status');
        expect(transcodeProfile).to.respondTo('url');
        expect(transcodeProfile).to.respondTo('resourceUrl');
    }));
});
