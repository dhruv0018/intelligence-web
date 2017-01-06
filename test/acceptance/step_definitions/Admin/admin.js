var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var SchoolsPage = require("../../helper/Admin/schools");
var ConferencesPage = require("../../helper/Admin/conferences");

module.exports = function Coach(){
    var schools = new SchoolsPage();
    var conferences = new ConferencesPage();

    this.When(/^Admin click add a new school$/, function (done) {
        schools.addSchool().then(done);
    });

    this.When(/^I click "([^"]*)" tab$/, function (text, done){
        var self = this;

        self.waitForClickable(conferences.clickConferences()).then(done);
    });

    this.When(/^I search for conference with code "([^"]*)"$/, function (text, done){
        var self = this;
        var searchBox = element(by.name('conferenceCode'));

        self.waitForClickable(searchBox).sendKeys(text).then(
        	function(){
        		conferences.searchConference();
        		done();
        	}
        );
    });

    this.When(/^I click on the conference$/, function (done){
        var self = this;
        var conference = element(by.xpath('//a[@ui-sref="conference({id: conference.stringID})"]'));

        self.waitForClickable(conference).then(done);
    });

    this.When(/^I go to the conference as a film exchange admin$/, function (done){
        var self = this;
        var goToAs = $('.go-to-film-exchange');

        self.waitForClickable(goToAs).then(done);
    });

    this.Then(/^The save school button should be disabled$/, function (done) {
        var isEnabled = schools.btnSaveSchool.isEnabled();
        expect(isEnabled).to.eventually.be.false.and.notify(done)
    });

    this.Then(/^I should see "([^"]*)"$/, function (text, done) {
        var isCorrectConference = element(by.xpath('//h1[contains(text(),"' + text + '")]')).isDisplayed();
        expect(isCorrectConference).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should be able to go to the second page of results$/, function (done) {
    	var self = this;
        var isPagerPresent = element(by.css('[ng-click="selectPage(page + 1)"]')).isDisplayed();
        
        expect(isPagerPresent).to.eventually.be.true.and.notify(done);
    });

};
