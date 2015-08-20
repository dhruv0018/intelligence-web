import Entity from '../../../src/entities/entity';
import sampleEvent from './sample-data/event';

const schema = require('../../../schemas/event.json');

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

describe('Base Entity', () => {

    let entity;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach(inject(TagsetsFactory => {

        entity = new Entity();
    }));

    it('should exist', () => {

        expect(Entity).to.exist;
    });

    it('should have public API', () => {

        expect(Entity).to.respondTo('validate');
    });

    it('should throw an error if validate is called with no JSON object and/or schema', () => {

        expect(() => entity.validate()).to.throw(Error);
        expect(() => entity.validate({})).to.throw(Error);
    });

    // TODO: Finish tests for validate method.

    xit('should validate JSON according to a schema', () => {

        let validation = entity.validate(sampleEvent, schema);

        expect(validation).to.be.an.object;
        expect(validation.errors.length).to.equal(0);
    });
});
