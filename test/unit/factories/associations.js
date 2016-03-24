const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('AssociationsFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(AssociationsFactory) {

        expect(AssociationsFactory).to.exist;
    }));

});
