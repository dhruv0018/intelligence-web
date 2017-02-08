var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var AddFilmPage = require("../../helper/Coach/addFilm");
var GamesPage = require("../../helper/Games/games");
var FilmEditorPage = require("../../helper/Coach/filmEditor");
var ConferencesPage = require("../../helper/Admin/conferences");
const moment = require('moment');

module.exports = function Coach(){
    var addFilm = new AddFilmPage();
    var games = new GamesPage();
    var filmEditor = new FilmEditorPage();
    var conferences = new ConferencesPage();

    this.When(/^I upload a game$/, function (done) {
        addFilm.upload();
        done();
    });

    this.When(/^I click add film$/, function (done) {
        addFilm.clickAddFilm();
        done();
    });

    this.Then(/^I click Film Settings$/, function (done) {
        var self = this;
        self.waitForClickable(games.filmSettingsBtn, 1000).then(
            function(){
                games.clickSettings().then(done);
            }
        );
    });

    this.When(/^I select breakdown and submit$/, function (done) {
        games.breakAndSubmit().then(done);
    });

    this.When(/^I add opposing team "([^"]*)"$/, function (opposingTeam, done) {
        games.enterOpposingTeam(opposingTeam);
        games.clickNext();
        done();
    });

    this.When(/^I add canonical team "([^"]*)"$/, function (opposingTeam, done) {
        games.enterCanonicalTeam(opposingTeam).then(
            function(){
                //games.canonicalTeam.click().then(
                    //function(){
                        games.clickNext().then(done);
                    //}
                //)
            }
        );
    });    

    this.When(/^I add a home game$/, function (done) {
        var self = this;

        self.waitForClickable(games.homeGame).then(done);
    });

    this.Then(/^I add new canonical team "([^"]*)"$/, function (opposingTeam, done) {
        var self = this;

        self.waitForClickable(games.canonicalTeamField).sendKeys(opposingTeam + conferences.uniqueID).then(
            function(){
                self.waitForClickable(games.addNewTeam).then(
                    function(){
                        games.clickNext().then(done);
                    }
                );
            }
        );
    });

    this.Then(/^I should see rosters on homeTeam$/, function (done) {
        expect(games.homeRosterCount()).to.eventually.above(0);
        done();
    });

    this.Then(/^I click film cancel button$/, function (done) {
        games.clickCancel();
        done();
    });

    this.When(/^I click Film Editor tab$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.filmEditorTab).then(done);
    });

    this.When(/^I click Continue Editing$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.continueEditing).then(done);
    });

    this.Then(/^I should be in an editing state$/, function (done) {
        expect(filmEditor.finishEditing.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I click Create Clip$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.createClip).then(done);
    });

    this.When(/^I click End Clip$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.endClip).then(done);
    });    

    this.Then(/^I should see a play created$/, function (done) {
        expect(filmEditor.clip.first().isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I delete all clips$/, function(done) {
        var self = this;

        filmEditor.emptyClipsState.isPresent().then(function(result){
            if (result){
                done();
            }
            else{
                filmEditor.clip.then(function(createdClips){
                    for (var i=0; i<createdClips.length; i++){
                        (function(i){
                            self.waitForClickable(filmEditor.trashIcon).then(
                                function(){
                                    self.waitForClickable(filmEditor.btnDelete).then(
                                        function(){
                                            if (i == createdClips.length-1){
                                                done();
                                            }
                                        }
                                    );    
                                }
                            );          
                        })(i);
                    }
                });;
            }
        });
    });

    this.When(/^I click Finish Editing$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.finishEditing).then(done);
    });

    this.When(/^I click to edit a play$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.editClip).then(done);
    });

    this.Then(/^the pencil and trash icons should get replaced with a Cancel button$/, function (done) {
        var verifyIcons = Promise.all([
            expect(filmEditor.editClip.getAttribute('class')).to.become('edit ng-hide'),
            expect(filmEditor.deleteClip.first().getAttribute('class')).to.become('delete ng-hide'),
            expect(filmEditor.cancelEditing.isPresent()).to.eventually.be.true
        ]);
        expect(verifyIcons).to.become(["edit ng-hide", "delete ng-hide", true]).and.notify(done);
    });

    this.When(/^I click Cancel$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.cancelEditing).then(done);
    });

    this.Then(/^the pencil and trash icons should display$/, function (done) {
        var verifyIcons = Promise.all([
            expect(filmEditor.editClip.getAttribute('class')).to.become('edit'),
            expect(filmEditor.deleteClip.first().getAttribute('class')).to.become('delete')
        ]);
        expect(verifyIcons).to.become(["edit", "delete"]).and.notify(done);
    });

    this.Then(/^I should see an Update Start Time button$/, function (done) {
    
        expect(filmEditor.btnUpdateStartTime.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I select click Update Start Time$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.btnUpdateStartTime).then(done);
    });

    this.Then(/^I should see an Update End Time button$/, function (done) {
    
        expect(filmEditor.btnUpdateEndTime.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I click Update End Time$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.btnUpdateEndTime).then(done);
    });

    this.Then(/^I should see a Create Clip button$/, function (done) {
    
        expect(filmEditor.createClip.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^I should be able to click Continue Editing$/, function (done) {
        var button = element(by.xpath('//button[@ng-click="ctrl.toggleSelfEditorState()"]'));

        expect(button.getAttribute('disabled')).doesNotBecome('disabled').and.notify(done);
    });

    this.Then(/^I should not be able to edit any other play$/, function (done) {
    
        expect(filmEditor.disabledPlay.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I click Delete Clip$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.trashIcon).then(done);
    });

    this.When(/^I click to cancel the deletion$/, function (done) {
        var self = this;

        self.waitForClickable(filmEditor.cancelDelete).then(done);
    });

    this.Then(/^the play should not have been deleted$/, function (done) {
        expect(filmEditor.clip.first().isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I delete the game$/, function (done) {
        var self = this;

        self.waitForClickable(games.deleteGameLink).then(done);
    });

    this.When(/^I confirm the deletion$/, function (done) {
        var self = this;

        self.waitForClickable(games.btnConfirm).then(done);
    });

    this.When(/^I confirm the reel deletion$/, function (done) {
        var self = this;

        self.waitForClickable(games.btnDeleteReelConfirm).then(done);
    });

    this.When(/^I select the first play$/, function (done) {
        var self = this;

        self.waitForClickable(games.checkBox).then(done);
    });

    this.When(/^I click Add to Reel$/, function (done) {
        var self = this;

        self.waitForClickable(games.btnAddToReel).then(done);
    });

    this.When(/^I click Create New Reel$/, function (done) {
        var self = this;

        self.waitForClickable(games.createNewReel).then(done);
    });

    this.When(/^I create the reel with name "([^"]*)"$/, function (reelName, done) {
        var self = this;

        self.waitForClickable(games.newReelName).sendKeys(reelName + conferences.uniqueID).then(
            function(){
                self.waitForClickable(games.createReelAddClip).then(done);
            }
        );
    });

    this.When(/^I delete the reel$/, function (done) {
        var self = this;

        self.waitForClickable(games.deleteReelLink).then(done);
    });

}
