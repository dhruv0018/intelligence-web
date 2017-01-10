var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var AddFilmPage = require("../../helper/Coach/addFilm");
var GamesPage = require("../../helper/Games/games");

module.exports = function Coach(){
    var addFilm = new AddFilmPage();
    var games = new GamesPage();

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

    this.When(/^I add opposingTeam "([^"]*)"$/, function (opposingTeam, done) {
        games.enterOpposingTeam(opposingTeam);
        games.clickNext();
        done();
    });

    this.Then(/^I should see rosters on homeTeam$/, function (done) {
        expect(games.homeRosterCount()).to.eventually.above(0);
        done();
    });

    this.Then(/^I click film cancel button$/, function (done) {
        games.clickCancel();
        done();
    });
}
