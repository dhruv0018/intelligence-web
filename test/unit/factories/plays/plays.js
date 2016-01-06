const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const moment = require('moment');

describe('PlaysFactory', function() {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(function(PlaysFactory) {

        expect(PlaysFactory).to.exist;
    }));

});
