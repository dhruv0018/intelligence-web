import Entity from '../../../src/entities/entity';
import genericData from './sample-data/generic-data';
import genericDataBad from './sample-data/generic-data-bad';
const genericSchema = require('./sample-data/generic-schema.json');

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

    it('should throw an error if validate is called with no schema', () => {

        expect(() => entity.validate()).to.throw(Error);
        expect(() => entity.validate(genericData)).to.throw(Error);
    });

    it('should throw an error if validate is called with no JSON object', () => {

        entity.schema = genericSchema;

        expect(() => entity.validate()).to.throw(Error);
    });

    // TODO: Finish tests for validate method.

    it('should validate valid JSON according to a schema', () => {

        entity.schema = genericSchema;
        let validation = entity.validate(genericData);

        expect(validation).to.be.an.object;
        expect(validation.errors).to.be.an.array;
        expect(validation.errors.length).to.equal(0);
        expect(validation.valid).to.be.a.boolean;
        expect(validation.valid).to.be.true;
    });

    it('should validate invalid JSON according to a schema', () => {

        entity.schema = genericSchema;
        let validation = entity.validate(genericDataBad);

        expect(validation).to.be.an.object;
        expect(validation.errors).to.be.an.array;
        expect(validation.errors.length).to.equal(1);
        expect(validation.valid).to.be.a.boolean;
        expect(validation.valid).to.be.false;
    });
});
