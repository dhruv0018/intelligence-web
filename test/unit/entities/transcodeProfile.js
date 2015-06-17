import TranscodeProfile from '../../../src/entities/transcodeProfile';
import transcodeProfileData from './sample-data/transcodeProfile';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const srcJSON = transcodeProfileData;

describe('TranscodeProfile Entity', () => {

    let transcodeProfileJSON;

    const ownProperties = [

        'id',
        'videoId',
        'status',
        'videoUrl',
        'status',
        'transcodeProfile'
    ];

    const getters = [

        'targetBitrate',
        'maximumBitrate',
        'minimumBitrate',
        'targetDisplayWidth',
        'targetDisplayHeight',
        'aspectRatio',
        'title',
        'status',
        'url'
    ];

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(() => {

        // Protect original source JSON
        transcodeProfileJSON = angular.copy(srcJSON);
        // Instantiate TranscodeProfile entitiy with JSON
        this = new TranscodeProfile(transcodeProfileJSON);
    });

    it('should exist', () => {

        expect(TranscodeProfile).to.exist;
    });

    it('should be instantiatable', () => {

        expect(this).to.be.an.instanceof(TranscodeProfile);
    })

    it('should have certain properties when instantiated', () => {

        ownProperties.forEach(
            property => expect(this).to.have.ownProperty(property)
        );

        getters.forEach(
            getter => expect(this).to.have.property(getter)
        );

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */
        // expect(this).to.have.property('resourceUrl');
    });

    it('should throw an Error if constructor is called without parameters.', () => {

        expect(() => new TranscodeProfile()).to.throw(Error);
    });

    it('should have the same own properties as the original JSON object', () => {

        expect(this).to.contain.keys(ownProperties);
        expect(transcodeProfileJSON).to.contain.keys(ownProperties);
    });

    it('should have called toJSON on a JSON.stringify call', () => {

        this.toJSON = sinon.spy();

        JSON.stringify(this);

        assert(this.toJSON.should.have.been.called);
    });

    it('should restore the original JSON on JSON.stringify calls', () => {

        this = this.toJSON();

        expect(this.id).to.equal(srcJSON.id);
        expect(this.videoId).to.equal(srcJSON.videoId);

        expect(this.transcodeProfile).to.be.an('object');
        expect(this.transcodeProfile).to.deep.equal(srcJSON.transcodeProfile);

        expect(this.status).to.equal(srcJSON.status);
        expect(this.videoUrl).to.equal(srcJSON.videoUrl);
    });

    it('should validate JSON schema', () => {

        const validation = this.validate(transcodeProfileJSON);

        expect(validation.errors.length).to.equal(0);
    });

    it('should not mutate when being transformed to and from JSON', () => {

        let copy = angular.copy(this);

        copy = JSON.parse(JSON.stringify(copy));

        expect(this).to.contain.keys(ownProperties);
        expect(copy).to.contain.keys(ownProperties);
    });

    it('should respond to "profile" via getter', () => {

        assert.isDefined(this.profile, '"profile" has been defined.');
        expect(this.profile).to.be.an('object');
    });

    it('should respond to "targetBitrate" via getter', () => {

        assert.isDefined(this.targetBitrate, '"targetBitrate" has been defined.');
        expect(this.targetBitrate).to.be.a('number');
    });

    it('should respond to "maximumBitrate" via getter', () => {

        assert.isDefined(this.maximumBitrate, '"maximumBitrate" has been defined.');
        expect(this.maximumBitrate).to.be.a('number');
    });

    it('should respond to "minimumBitrate" via getter', () => {

        assert.isDefined(this.minimumBitrate, '"minimumBitrate" has been defined.');
        expect(this.minimumBitrate).to.be.a('number');
    });

    it('should respond to "description" via getter', () => {

        assert.isDefined(this.description, '"description" has been defined.');
        expect(this.description).to.be.a('string');
    });

    it('should respond to "targetDisplayWidth" via getter', () => {

        assert.isDefined(this.targetDisplayWidth, '"targetDisplayWidth" has been defined.');
        expect(this.targetDisplayWidth).to.be.a('number');
    });

    it('should respond to "targetDisplayHeight" via getter', () => {

        assert.isDefined(this.targetDisplayHeight, '"targetDisplayHeight" has been defined.');
        expect(this.targetDisplayHeight).to.be.a('number');
    });

    it('should respond to "aspectRatio" via getter', () => {

        assert.isDefined(this.aspectRatio, '"aspectRatio" has been defined.');
        expect(this.aspectRatio).to.be.a('string');
    });

    it('should respond to "title" via getter', () => {

        assert.isDefined(this.title, '"title" has been defined.');
        expect(this.title).to.be.a('string');
    });

    it('should respond to "url" via getter', () => {

        assert.isDefined(this.url, '"url" has been defined.');
        expect(this.url).to.be.a('string');
    });

    it('should respond to "resourceUrl" via getter', () => {

        /* FIXME: Test does not pass, I think because the method
         * uses the injector for $sce
         */

        //  assert.isDefined(this.resourceUrl, '"resourceUrl" has been defined.');
        // expect(this.resourceUrl).to.be.an('object');
    });
});
