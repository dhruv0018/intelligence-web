var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var FilmExchange = require("../../helper/film-exchange/film-exchange");

module.exports = function() {

    var filmExchanges = new FilmExchange();

    this.When(/^I go to the "([^"]*)" film exchange$/, function(text, done) {
        var self = this;
        var filmExchangeName = element(by.xpath('/descendant::a[contains(text(),"' + text + '")][2]'));

        browser.actions().mouseMove(filmExchanges.dropdown).mouseMove(filmExchangeName).click().perform().then(
            function(){
                done();
            }
        );
    });

    this.When(/^I share the first game with "([^"]*)" film exchange$/, function(filmExchange, done) {
        var self = this;

        self.waitForClickable(filmExchanges.btnFirstShare).then(
            function(){
                filmExchanges.filmExchangeOption.click().then(
                    function(){
                        element.all(by.css('.film-exchange-option')).each(
                            function(option){
                                option.getText().then(
                                    function(label){
                                        if(label.indexOf(filmExchange) > -1){
                                            option.click().then(
                                                function(){
                                                    self.waitForClickable(filmExchanges.shareButtonModal).then(
                                                        function(){
                                                            self.waitForClickable(filmExchanges.btnCloseShare).then(done);
                                                        }
                                                    );
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        );
                    }
                );
            }
        );
    });

    this.When(/^I search for games with team name "([^"]*)"$/, function(team, done) {
        var self = this;

        self.waitForClickable(filmExchanges.teamSearchBox).sendKeys(team).then(
            function(){
                filmExchanges.clickSearchButton().then(
                    function(){
                        browser.sleep(3000).then(
                            function(){
                            done();
                            }
                        );
                    }
                );
            }
        );
    });

    this.Then(/^I should see all games that involved team "([^"]*)"$/, function(team, done) {
        var teamName = element(by.xpath('//span[contains(text(),"' + team + '")]'));

        expect(teamName.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I search for games that were played today$/, function(done) {
        var self = this;

        self.waitForClickable(filmExchanges.dateSearchBox).sendKeys(filmExchanges.date).then(
            function(){
                filmExchanges.clickSearchButton().then(
                    function(){
                        browser.sleep(3000).then(
                            function(){
                            done();
                            }
                        );
                    }
                );
            }
        );
    });

    this.Then(/^I should see the game that I uploaded today$/, function(done) {
        var self = this;
        var datePlayed = element(by.xpath('//span[contains(text(),"' + filmExchanges.resultsDate + '")]'));

        expect(datePlayed.isPresent()).to.eventually.be.true.and.notify(done);
    });

    this.When(/^I click to reset search results$/, function(done) {
        var self = this;

        self.waitForClickable(filmExchanges.btnReset).then(done);
    });

    this.When(/^I click on a game in the film exchange$/, function(done) {
        var self = this;

        self.waitForClickable(filmExchanges.teamName).then(done);
    });

    this.When(/^I click to play the raw film$/, function(done) {
        var self = this;

        self.waitForClickable(filmExchanges.btnPlay).then(done);
    });


    this.When(/^I click to manage team access$/, function(done) {
        var self = this;

        self.waitForClickable(filmExchanges.btnTeamAccess).then(done);
    });

    this.When(/^I suspend the team "([^"]*)"$/, function(team, done) {
        var self = this;

        self.waitForClickable(filmExchanges.modalSearchBox).sendKeys(team).then(
            function(){
                browser.sleep(5000).then(
                    function(){
                        filmExchanges.accessSwitch.getAttribute('aria-checked').then(function(selectedArr){
                            for (var i=0; i<selectedArr.length; i++){
                                (function(i){
                                    if (selectedArr[i] == 'false'){
                                        filmExchanges.accessSwitch.get(i).click().then(
                                            function(){
                                                if (i == selectedArr.length-1){
                                                    done();
                                                }
                                            }
                                        );
                                    }
                                    else{
                                        done();
                                    }
                                })(i);
                            }
                        });
                    }
                );
            }
        );
    });

    this.When(/^I enable the team "([^"]*)"$/, function(team, done) {
        var self = this;

        self.waitForClickable(filmExchanges.modalSearchBox).sendKeys(team).then(
            function(){
                browser.sleep(5000).then(
                    function(){
                        filmExchanges.accessSwitch.getAttribute('aria-checked').then(function(selectedArr){
                            for (var i=0; i<selectedArr.length; i++){
                                (function(i){
                                    if (selectedArr[i] == 'true'){
                                        filmExchanges.accessSwitch.get(i).click().then(
                                            function(){
                                                if (i == selectedArr.length-1){
                                                    done();
                                                }
                                            }
                                        );
                                    }
                                    else{
                                        done();
                                    }
                                })(i);
                            }
                        });
                    }
                );
            }
        );
    });

    this.Then(/^the team's coach should not be able to access the "([^"]*)" film exchange$/, function(filmExchangeName, done) {
        var self = this;
        var isSuspended = element(by.cssContainingText('.suspended', filmExchangeName));

        self.waitForClickable(filmExchanges.filmExchangeMenu).then(
            function(){
                browser.sleep(2000).then(
                    function(){
                        expect(isSuspended.isPresent()).to.eventually.be.true.and.notify(done);
                    }
                )
            }
        )
    });

    this.Then(/^the team's coach should be able to access the "([^"]*)" film exchange$/, function(filmExchangeName, done) {
        var self = this;
        var isSuspended = element(by.cssContainingText('.suspended', filmExchangeName));

        self.waitForClickable(filmExchanges.filmExchangeMenu).then(
            function(){
                browser.sleep(2000).then(
                    function(){
                        expect(isSuspended.isPresent()).to.eventually.be.false.and.notify(done);
                    }
                )
            }
        )
    });

    this.Then(/^I should see a pause button$/, function(done) {
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(filmExchanges.btnPause.isPresent()).to.eventually.be.true.and.notify(done);
            }
        )
    });

    this.When(/^I close the modal$/, function(done) {
        var self = this;

        expect(filmExchanges.btnClose.isPresent()).to.eventually.be.true.and.then(
            function(){
                filmExchanges.btnClose.click().then(done);
            }
        )
    });

    this.Then(/^I should see a modal to manage access for teams in the film exchange$/, function(done) {
        var self = this;

        browser.sleep(1000).then(
            function(){
                expect(filmExchanges.teamAccessModal.isPresent()).to.eventually.be.true.and.notify(done);
            }
        )
    });
}
