var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var SchoolsPage = require("../../helper/Admin/schools");
var ConferencesPage = require("../../helper/Admin/conferences");
var TeamsPage = require("../../helper/Admin/teams");
var FilmExchangePage = require("../../helper/film-exchange/film-exchange");
var view = require('../../helper/view');
const moment = require('moment');

module.exports = function Coach(){
    var schools = new SchoolsPage();
    var conferences = new ConferencesPage();
    var teams = new TeamsPage();
    var filmExchanges = new FilmExchangePage();

    this.When(/^I click add a new school$/, function (done) {
        schools.addSchool().then(done);
    });

    this.When(/^I click "([^"]*)" tab$/, function (text, done){
        var self = this;

        self.waitForClickable(conferences.clickConferences()).then(done);
    });

    this.When(/^I search for conference with code "([^"]*)"$/, function (text, done){
        var self = this;

        self.waitForClickable(conferences.conferenceAdminSearchBox).sendKeys(text).then(
        	function(){
        		conferences.searchConference();
        		done();
        	}
        );
    });

    this.When(/^I click on the conference$/, function (done){
        var self = this;

        self.waitForClickable(conferences.conferenceAdminName).then(done);
    });

    this.When(/^I go to the conference as a film exchange admin$/, function (done){
        var self = this;

        self.waitForClickable(conferences.goToAs).then(done);
    });

    this.When(/^I go to the Associations page$/, function (done){
        var self = this;
        var associationsOption = element(by.xpath('/descendant::a[contains(text(),"Associations")][2]'));

        browser.actions().mouseMove(conferences.dropdown).mouseMove(associationsOption).click().perform().then(
            function(){
                done();
            }
        );
    });

    this.When(/^I click add a new association$/, function (done){
        var self = this;

        self.waitForClickable(conferences.btnNewAssociation).then(done);
    });

    this.When(/^I enter association code "([^"]*)"$/, function (code, done){
        var self = this;
        self.waitForClickable(conferences.conferenceCode).sendKeys(code + conferences.uniqueID).then(done);
    });

    this.When(/^I enter association name "([^"]*)"$/, function (name, done){
        var self = this;
        self.waitForClickable(conferences.conferenceName).sendKeys(name + conferences.uniqueID).then(done);
    });

    this.When(/^I enter association acronym "([^"]*)"$/, function (acronym, done){
        var self = this;
        self.waitForClickable(conferences.conferenceAcronym).sendKeys(acronym + conferences.uniqueID).then(done);
    });

    this.When(/^I save the association$/, function (done){
        var self = this;

        self.waitForClickable(conferences.btnSaveAssociation).then(done);
    });

    this.When(/^I click Competition Levels tab$/, function (done){
        var self = this;

        self.waitForClickable(conferences.competitionLevelTab).then(done);
    });

    this.When(/^I enter competition code "([^"]*)"$/, function (code, done){
        var self = this;
        self.waitForClickable(conferences.newCompetitionCode).sendKeys(code + conferences.uniqueID).then(done);
    });

    this.When(/^I enter competition name "([^"]*)"$/, function (name, done){
        var self = this;
        self.waitForClickable(conferences.newCompetitionName).sendKeys(name + conferences.uniqueID).then(done);
    });

    this.When(/^I click Add Competition Level$/, function (done){
        var self = this;

        self.waitForClickable(conferences.btnNewCompetitionLevel).then(done);
    });

    this.Then(/^The competition level should be created$/, function (done) {
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(conferences.competitionLevelSuccess.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.When(/^I click Conferences tab$/, function (done){
        var self = this;
        self.waitForClickable(conferences.conferencesTab).then(done);
    });

    this.When(/^I enter conference code "([^"]*)"$/, function (code, done){
        var self = this;
        self.waitForClickable(conferences.newConferenceCode).sendKeys(code + conferences.uniqueID).then(done);
    });

    this.When(/^I enter conference name "([^"]*)"$/, function (name, done){
        var self = this;
        self.waitForClickable(conferences.newConferenceName).sendKeys(name + conferences.uniqueID).then(done);
    });

    this.When(/^I click Add Conference$/, function (done){
        var self = this;
        self.waitForClickable(conferences.btnNewConference).then(done);
    });

    this.Then(/^The conference should be created$/, function (done) {
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(conferences.conferenceSuccess.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.Then(/^The save school button should be disabled$/, function (done) {
        var isEnabled = schools.btnSaveSchool.isEnabled();
        expect(isEnabled).to.eventually.be.false.and.notify(done)
    });

    this.Then(/^I should see "([^"]*)"$/, function (text, done) {
        var isCorrectConference = element(by.xpath('//h1[contains(text(),"' + text + '")]'));

        expect(isCorrectConference.isDisplayed()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should be able to go to the second page of results$/, function (done) {
    	var self = this;

        expect(conferences.isPagerPresent.isDisplayed()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^The association should be created$/, function (done) {
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(conferences.associationSuccess.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.When(/^I click the Add Sport link$/, function (done){
        var self = this;

        self.waitForClickable(conferences.linkAddSport).then(done);
    });

    this.When(/^I click Add Sport$/, function (done){
        var self = this;

        browser.sleep(1000).then(
            function(){
                self.waitForClickable(conferences.btnAddSport).then(done);
            }
        )
    });

    this.Then(/^The sport should be added$/, function (done){
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(conferences.sportAddedSuccess.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.When(/^I click Film Exchanges tab$/, function (done){
        var self = this;

        self.waitForClickable(conferences.filmExchangesTab).then(done);
    });

    this.When(/^I select a conference gender sport$/, function (done){
        var self = this;

        self.waitForClickable(conferences.filmExchangeDropdown).then(
            function(){
                self.waitForClickable(conferences.conferenceGenderSport).then(done);
            }
        )
    });

    this.When(/^I make it visible to teams$/, function (done){
        var self = this;

        self.waitForClickable(conferences.checkboxVisibleToTeams).then(done);
    });

    this.When(/^I click Add Film Exchange$/, function (done){
        var self = this;

        self.waitForClickable(conferences.btnAddFilmExchange).then(done);
    });

    this.Then(/^The film exchange should be added$/, function (done){
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(conferences.filmExchangeSuccess.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.When(/^I search for team "([^"]*)"$/, function (team, done){
        var self = this;

        self.waitForClickable(teams.teamNameSearch).sendKeys(team).then(
            function(){
                teams.btnSearch.click().then(done);
            }
        );
    });

    this.When(/^I click on the team "([^"]*)"$/, function (team, done){
        var self = this;
        var teamSearchResult = element(by.linkText(team));

        self.waitForClickable(teamSearchResult).then(done);
    });

    this.When(/^I go to the Conferences tab$/, function (done){
        var self = this;

        self.waitForClickable(teams.conferencesTab).then(done);
    });

    this.When(/^I search for the conference "([^"]*)"$/, function (conference, done){
        var self = this;

        self.waitForClickable(teams.teamConferenceDropDown).then(
            function(){
                self.waitForClickable(teams.teamConferenceSearchBox).sendKeys(conference+conferences.uniqueID).then(
                    function(){
                        self.waitForClickable(teams.teamConferenceSearchResult).then(done);
                    }
                );
            }
        );
    });

    this.When(/^I add the conference$/, function (done){
        var self = this;

        self.waitForClickable(teams.btnAddConference).then(done);
    });

    this.When(/^I save the conference$/, function (done){
        var self = this;

        self.waitForClickable(teams.btnSaveTeamConference).then(done);
    });

    this.Then(/^I should have access to the "([^"]*)" film exchange$/, function (filmExchange, done){
        var self = this;
        var filmExchangeOption = element.all(by.xpath('//a[contains(text(),"' + filmExchange + conferences.uniqueID + '")]')).last();
        self.waitForClickable(filmExchanges.filmExchangeMenu).then(
            function(){
                expect(filmExchangeOption.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.When(/^I click on association with name "([^"]*)"$/, function (association, done){
        var self = this;
        association = association+conferences.uniqueID;
        var associationLink = element(by.partialLinkText(association));

        self.waitForClickable(associationLink).then(done);
    });

    this.When(/^I edit the film exchange$/, function (done){
        var self = this;
        var filmExchangeEdit = element(by.css('i.icon.icon-pencil'));

        self.waitForClickable(filmExchangeEdit).then(done);
    });

    this.When(/^I make the film exchange invisible to teams$/, function (done){
        var self = this;
        var editCheckbox = element.all(by.xpath("//i[(contains(@class, 'icon-check-square'))]")).last();

        editCheckbox.getAttribute('class').then(function(classNames){

            if (classNames.indexOf('ng-hide') == -1){
                conferences.editCheckboxVisibleToTeams.click().then(done);
            }
            else{
                done();
            }
        });
    });

    this.Then(/^I should NOT have access to the "([^"]*)" film exchange$/, function (filmExchange, done){
        var self = this;
        filmExchange = filmExchange + conferences.uniqueID;
        var filmExchangeOption = element(by.xpath('//a[contains(text(),"' + filmExchange + '")]'));

        self.waitForClickable(filmExchanges.filmExchangeMenu).then(
            function(){
                expect(filmExchangeOption.isPresent()).to.eventually.be.false.and.notify(done);
            }
        )
    });

    this.When(/^I remove the conference from the team$/, function (done){
        var self = this;

        self.waitForClickable(teams.removeConferenceTeam).then(done);
    });

    this.When(/^I delete the "([^"]*)"$/, function (item, done){
        var self = this;

        self.waitForClickable(conferences.trashIcon).then(
            function(){
                self.waitForClickable(conferences.confirmDeletion).then(done);
            }
        );
    });

    this.When(/^I click Association Information tab$/, function (done){
        var self = this;

        self.waitForClickable(conferences.associationInformationTab).then(done);
    });

    this.When(/^I delete the association$/, function (done){
        var self = this;

        conferences.clickAssociationDeleteLink().then(
            function(){
                self.waitForClickable(conferences.confirmDeletion).then(done);
            }
        );
    });

    this.Then(/^The association should be deleted$/, function (done) {
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(conferences.associationDeletedSuccess.isDisplayed()).to.eventually.be.true.and.notify(done);
            }
        )
    });

};
