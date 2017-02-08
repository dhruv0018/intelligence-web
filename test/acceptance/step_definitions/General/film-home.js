var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Header = require("../../helper/header");
var FilmHome = require("../../helper/film-home/film-home");
var ConferencesPage = require("../../helper/Admin/conferences");
const moment = require('moment');

module.exports = function() {
    var header = new Header();
    var filmHome = new FilmHome();
    var conferences = new ConferencesPage();

    this.When(/^I go to film home$/ , function(done){
        header.clickCoachFilmHome().then(done);
    });

    this.When(/^I click "([^"]*)" tab on film home$/, function(tabName, done) {
        var self = this;

        self.waitForClickable(filmHome.clickTab(tabName)).then(done);
    });

    this.When(/^I search for game "([^"]*)"$/, function (text, done){
        var self = this;

        self.waitForClickable(filmHome.gameSearchBox).sendKeys(text).then(
            function(){
                browser.sleep(1000).then(
                    function(){
                        self.waitForInvisible($('.loading'));
                        done();
                    }
                )
            }
        );
    });

    this.When(/^I search for reel "([^"]*)"$/, function (text, done){
        var self = this;

        self.waitForClickable(filmHome.reelSearchBox()).sendKeys(text).then(
            function(){
                done();
            }
        );
    });

    this.When(/^I select "([^"]*)" game$/, function (text, done) {
        var self = this;
        var game = element.all(by.xpath('//div[contains(text(),"' + text + '")]')).first();

        self.waitForClickable(game).then(
            function(){
                done();
            }
        )
    });

    this.When(/^I select first game$/, function (done) {
        var self = this;

        filmHome.selectFirstGame();
        self.waitForClickable(filmHome.player).then(
            function(){
                done();
            }
        )
    });

    this.When(/^I select first reel$/, function (done) {
        var self = this;

        filmHome.selectFirstReel();
        self.waitForClickable(filmHome.player).then(
            function(){
                done();
            }
        )
    });

    this.When(/^I filter and select first breakdown$/, function (done) {
        var self = this;

        self.waitForClickable(filmHome.filmHomeFilter).then(
            function(){
                self.waitForClickable(filmHome.filterBreakdowns).then(
                    function(){
                        self.waitForClickable(filmHome.btnApply).then(
                            function(){
                                browser.sleep(2000).then(
                                    function(){
                                        self.waitForClickable(filmHome.game).then(done);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        )
    });

    this.When(/^I click Order Now button$/, function (done) {
        var self = this;

        self.waitForClickable(filmHome.wscBtn).then(function(){
            browser.sleep(10000).then(done);
        });
    });

    this.Then(/^I should only see "([^"]*)" on film home$/, function (type, done) {
        if(type === 'Reels'){
            expect(filmHome.numClipsDiv.isPresent()).to.eventually.be.true.and.notify(done);
        }else{
            expect(filmHome.thumbnailDiv.isPresent()).to.eventually.be.true.and.notify(done);
        }
    });

    this.Then(/^I should see WSC Order button$/, function (done) {
        expect(filmHome.wscBtn.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should see the game involving "([^"]*)" on film home$/, function (team, done) {
        expect(filmHome.firstAwayTeam.getText()).to.eventually.equal(team + conferences.uniqueID).and.notify(done);
    });

    this.Then(/^I should see a confirmation that the game was deleted$/, function (done) {
        expect(filmHome.gameDeletedSuccess.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should not see the game involving "([^"]*)" on film home$/, function (team, done) {
        expect(filmHome.firstAwayTeam.getText()).to.eventually.not.equal(team + conferences.uniqueID).and.notify(done);
    });

    this.Then(/^I should see a reel with name "([^"]*)" on film home$/, function (reel, done) {
        var self = this;
        var EC = protractor.ExpectedConditions;

        //browser.wait(EC.visibilityOf(filmHome.firstReelName), 30000).then(
        this.waitForVisible(filmHome.firstReelName, 30000).then(
            function(){
                expect(filmHome.firstReelName.getText()).to.eventually.equal(reel + conferences.uniqueID).and.notify(done);
            }
        )
    });

    this.Then(/^I should be on the Reels tab$/, function (done) {
        expect(filmHome.activeReelsTab.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should not see the reel involving "([^"]*)" on film home$/, function (reel, done) {
        expect(filmHome.firstReelName.getText()).to.eventually.not.equal(reel + conferences.uniqueID).and.notify(done);
    });

};
