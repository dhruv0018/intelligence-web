const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('FormationLabelsFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(FormationLabelsFactory) {

        expect(FormationLabelsFactory).to.exist;
    }));

});
