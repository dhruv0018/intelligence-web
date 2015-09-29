const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

describe('NewDate Factory', () => {

    beforeEach(angular.mock.module('intelligence-web-client'));

    it('should exist', inject(NewDate => {

        expect(NewDate).to.exist;
    }));
});
