var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Header = require("../../helper/header");
var FilmHome = require("../../helper/film-home/film-home");
var ConferencesPage = require("../../helper/Admin/conferences");
var ReelsPage = require("../../helper/reel/reel");
const moment = require('moment');

module.exports = function() {
    var header = new Header();
    var filmHome = new FilmHome();
    var conferences = new ConferencesPage();
    var reels = new ReelsPage();

    this.When(/^I go to film home$/ , function(done){
        header.clickCoachFilmHome().then(done);
    });

    this.When(/^I click "([^"]*)" tab on film home$/, function(tabName, done) {
        var self = this;

        self.waitForClickable(filmHome.clickTab(tabName)).then(done);
    });

    this.When(/^I search for game "([^"]*)"$/, function (text, done){
        var self = this;

        filmHome.gameSearchBox.isDisplayed().then(function(isVisible){
            if(isVisible){
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
            }
            else{
                done();
            }
        });
    });

    this.When(/^I search for reel "([^"]*)"$/, function (text, done){
        var self = this;

        filmHome.reelSearchBox.isDisplayed().then(function(isVisible){
            if(isVisible){
                self.waitForClickable(filmHome.reelSearchBox).sendKeys(text).then(
                    function(){ 
                        done();
                    }
                );
            }
            else{
                done();
            }
        });
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
            expect(filmHome.reels.isPresent()).to.eventually.be.true.and.notify(done);
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

        self.waitForVisible(filmHome.firstReelName, 30000).then(
            function(){
                expect(filmHome.firstReelName.getText()).to.eventually.equal(reel).and.notify(done);
            }
        )
    });

    this.Then(/^I should be on the Reels tab$/, function (done) {
        expect(filmHome.activeReelsTab.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should not see the reel involving "([^"]*)" on film home$/, function (reel, done) {
        expect(filmHome.firstReelName.getText()).to.eventually.not.equal(reel + conferences.uniqueID).and.notify(done);
    });

    this.When(/^I filter for breakdowns$/, function (done) {
        var self = this;

        self.waitForClickable(filmHome.filmHomeFilter).then(
            function(){
                self.waitForClickable(filmHome.filterBreakdowns).then(
                    function(){
                        self.waitForClickable(filmHome.btnApply).then(done);
                    }
                );
            }
        );
    });

    this.When(/^I click to share the "([^"]*)" with Other Krossover Users$/, function(filmType, done) {
        var self = this;

        if (filmType=="reel"){
            self.waitForClickable(filmHome.btnReelShare).then(
                function(){
                    filmHome.shareOtherUsersOption.click().then(done);
                }
            );   
        }
        else{
            self.waitForClickable(filmHome.btnFirstShare).then(
                function(){
                    filmHome.shareOtherUsersOption.click().then(done);
                }
            );   
        }
    });

    this.When(/^I select user with name "([^"]*)" who is a coach of team "([^"]*)"$/, function(userName, teamName, done) {
        var self = this;

        filmHome.sharedTeam.isPresent().then(function(isVisible){
            if(isVisible){
                self.waitForClickable(filmHome.revokeShare).then(
                    function(){
                        self.waitForClickable(filmHome.userSearchBox).sendKeys(userName).then(
                            function(){
                                self.waitForClickable(filmHome.userSearchResult).then(
                                    function(){
                                        self.waitForClickable(filmHome.btnAdd).then(done);
                                    }
                                );
                            }
                        );
                    }
                );
            }
            else{
                self.waitForClickable(filmHome.userSearchBox).sendKeys(userName).then(
                    function(){
                        self.waitForClickable(filmHome.userSearchResult).then(
                            function(){
                                self.waitForClickable(filmHome.btnAdd).then(done);
                            }
                        );
                    }
                );
            }
        })
    });

    this.When(/^I click Add$/, function(done) {
        var self = this;

        self.waitForClickable(filmHome.btnAdd).then(done);
    });

    this.When(/^I click Done$/, function(done) {
        var self = this;

        self.waitForClickable(filmHome.btnDone).then(done);
    });

    this.Then(/^I should see a drop-down to share raw film or raw film and breakdown$/, function (done) {
        browser.sleep(2000).then(
            function(){
                expect(filmHome.shareFilmOptions.isPresent()).to.eventually.be.true.and.notify(done);    
            }
        );
    });

    this.Then(/^I should see the game I shared with away team name "([^"]*)"$/, function (teamName, done) {
        expect(filmHome.firstAwayTeam.getText()).to.eventually.equal(teamName).and.notify(done);
    });

    this.Then(/^I should see the game I shared with home team name "([^"]*)"$/, function (teamName, done) {
        var self = this;

        self.waitForVisible(filmHome.firstHomeTeam).then(
            function(){
                expect(filmHome.firstHomeTeam.getText()).to.eventually.equal(teamName + conferences.uniqueID).and.notify(done);
            }
        );
    });

    this.When(/^I click to revoke sharing of the "([^"]*)"$/, function(filmType, done) {
        var self = this;

        self.waitForClickable(filmHome.revokeShare).then(done);
    });

    this.Then(/^I should NOT see the "([^"]*)" I shared with name "([^"]*)"$/, function (filmType, teamName, done) {
        expect(filmHome.firstAwayTeam.isPresent()).to.eventually.be.false.and.notify(done);
    });

    this.Then(/^I should see text "([^"]*)" on the "([^"]*)"$/, function (txt, filmType, done) {
        var className = 'subtext';
        var element = $('.'+className);

        element.getText().then(function(strTxt){
            expect(strTxt.indexOf(txt)).to.above(-1);
            done();
        })
    });

    this.When(/^I filter for games that were shared with me$/, function (done) {
        var self = this;

        self.waitForClickable(filmHome.filmHomeFilter).then(
            function(){
                self.waitForClickable(filmHome.filterSharedWithMe).then(
                    function(){
                        self.waitForClickable(filmHome.btnApply).then(done);
                    }
                );
            }
        );
    });

    this.Then(/^I should see the reel I shared with name "([^"]*)"$/, function (teamName, done) {
        expect(filmHome.firstReelName.getText()).to.eventually.equal(teamName).and.notify(done);
    });

    this.Then(/^I should NOT see the share button next to the reel$/, function (done) {
        
        expect(filmHome.btnReelShare.isPresent()).to.eventually.be.true.and.notify(done);    
    });

    this.When(/^I click on the reel with name "([^"]*)"$/, function (reelName, done) {
        var self = this;
        var reel = element.all(by.xpath('//div[contains(text(),"' + reelName + '")]')).first();

        self.waitForClickable(reel).then(done);
    });

    this.Then(/^I should NOT be able to edit the reel$/, function (done) {
        
        expect(reels.editPlays.isPresent()).to.eventually.be.false.and.notify(done);    
    });
};
