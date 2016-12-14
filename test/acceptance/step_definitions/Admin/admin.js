var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var SchoolsPage = require("../../helper/Admin/schools");

module.exports = function Coach(){
    var schools = new SchoolsPage();

    this.When(/^Admin click add a new school$/, function (done) {
        schools.addSchool().then(done);
    });


    this.Then(/^The save school button should be disabled$/, function (done) {
        var isEnabled = schools.btnSaveSchool.isEnabled();
        expect(isEnabled).to.eventually.be.false;
        done();
    });

}
