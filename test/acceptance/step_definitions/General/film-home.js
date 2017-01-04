var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Header = require("../../helper/header");
var FilmHome = require("../../helper/film-home/film-home");

module.exports = function() {

    var header = new Header();
    var filmHome = new FilmHome();

    this.When(/^I go to film home$/ , function(done){
        header.clickCoachFilmHome().then(done);
    });
    this.When(/^I click "([^"]*)" tab on film home$/, function(tabName, done) {

        filmHome.clickTab(tabName).then(done);
    });

    this.When(/^I search for game "([^"]*)"$/, function (text, done){
        var self = this;
        var searchBox =$('#film-search-cta');

        self.waitForClickable(searchBox).sendKeys(text).then(
            function(){
                browser.sleep(1000).then(
                //self.waitForVisible($('.loading')).then( 
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
        var searchBox =$('#reel-search-cta');

        self.waitForClickable(searchBox).sendKeys(text).then(
            function(){
                done();
            }
        );
    });

    this.When(/^I select "([^"]*)" game$/, function (text, done) {
        var self = this;
        var game = element(by.xpath('//div[contains(text(),"' + text + '")]'));

        self.waitForClickable(game).then(
            function(){
                done();
            }
        )
    });

    this.When(/^I select first game$/, function (done) {
        var self = this;
        var player = $('.video-player');

        filmHome.selectFirstGame();
        self.waitForClickable(player).then(
            function(){
                done();
            }
        )
    });

    this.When(/^I select first reel$/, function (done) {
        var self = this;
        var player = $('.video-player');

        filmHome.selectFirstReel();
        self.waitForClickable(player).then(
            function(){
                done();
            }
        )
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

};