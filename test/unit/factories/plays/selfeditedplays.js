const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const moment = require('moment');

describe('SelfEditedPlaysFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(SelfEditedPlaysFactory) {

        expect(SelfEditedPlaysFactory).to.exist;
    }));

});
