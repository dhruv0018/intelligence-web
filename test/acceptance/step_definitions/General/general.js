var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Header = require("../../helper/header");
var Account = require("../../helper/account");

module.exports = function() {

    var header = new Header();
    var account = new Account();

    this.Given(/^I navigate to the "([^"]*)" page$/, function(relativeUrl, done) {

        browser.get(relativeUrl).then(done);
    });

    this.Then(/^I should see the "([^"]*)" page$/, function(pageName, done) {
        var self = this;
        if(pageName == 'film-home'){
            browser.sleep(3000);
        }

        expect(self.urlContains(pageName)).to.eventually.be.true.and.notify(done);
    });

    //Click on text block
    this.When(/^I click on "([^"]*)"$/, function(text, done){
        element(by.xpath('.//*[normalize-space(text())="' + text + '"]')).click().then(
            function(){
                done();
            }
        );
    });

    this.When(/^Admin click "([^"]*)" on Admin menu$/, function(menuItem, done) {
        header.clickAdminMenu(menuItem).then(done);
    });

    //For select option in dropdown
    this.When(/^I pick option "([^"]*)" from dropdown "([^"]*)"$/, function (option, name, done) {
        element(by.name(name)).$('[label="'+option+'"]').click().then(done);
    });

    //For enter text in input box
    this.When(/^I enter "([^"]*)" for Input name "([^"]*)"$/, function (txt, name, done) {
        element(by.name(name)).sendKeys(txt).then(done);
    });

    this.Then(/^button id "([^"]*)" should be disabled$/, function (buttonID, done) {
        var isEnabled = element(by.id(buttonID)).isEnabled();
        expect(isEnabled).to.eventually.be.false;
        done();
    });

    this.When(/^I switch to role "([^"]*)"$/, function (text, done){
        var self = this;
        var dropdownMenu =$('#menu-dropdown-toggle');
        var selectRole = element.all(by.xpath('//div[contains(@class, "role-name") and normalize-space(.)="' + text + '"]')).first();

        self.waitForClickable(dropdownMenu, 9000).then(
            function(){
                selectRole.isDisplayed().then(function(isVisible){
                    if(isVisible){
                        selectRole.click();
                    }else{
                        dropdownMenu.click();
                    }
                    done();
                })
            }
        );
    });

    this.When(/^I go to user as "([^"]*)"$/, function (text, done){
        var self = this;
        var userEmail =$('#search-user-email-cta');
        var searchButton =$('#search-users-cta');
        var goToAs =$('#user-go-to-as-cta-user-0');

        self.waitForClickable(userEmail).sendKeys(text).then(
            function(){
                searchButton.click();
                goToAs.click();
                done();
            }
        );
    });

    //see text at div by class name
    this.Then(/^I should see text "([^"]*)" at "([^"]*)"$/, function (txt, className, done) {
        var element = $('.'+className);
        element.getText().then(function(strTxt){
            expect(strTxt.indexOf(txt)).to.above(-1);
            done();
        })
    });

    this.Then(/^I should see "([^"]*)" menu options in "([^"]*)" header$/, function (count, type, done) {
        count = parseInt(count);
        var self = this;
        var atheleteMenu = $('.athlete-role');
        var filmExchangeMenu = $('.film-exchange-admin-role');
        var menuItems = element.all(by.css('.header-desktop-menu>li:not(.ng-hide)'));
        var menuType;

        switch(type){
            case "Athlete":
                menuType = atheleteMenu;
                break;
            case "FilmExchange":
                menuType = filmExchangeMenu;
                break;
        }

        self.waitForClickable(menuType, 3000).then(
            function(){
                menuItems.count().then(function(data){
                    expect(data).to.equal(count);
                    done();
                });
            }
        );

    });


    this.When(/^I pause$/, function(done) {
        browser.pause();
        // browser.debugger();
    });
};
