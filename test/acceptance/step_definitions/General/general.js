var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Header = require("../../helper/header");
var Account = require("../../helper/account");
var view = require("../../helper/view");

module.exports = function() {

    var header = new Header();
    var account = new Account();

    this.Given(/^I navigate to the "([^"]*)" page$/, function(relativeUrl, done) {

        browser.get(relativeUrl).then(done);
    });

    this.Given(/^I go to the "([^"]*)" page$/, function(pageName, done) {

        browser.setLocation(pageName).then(done);
    });

    this.Then(/^I should see the "([^"]*)" page$/, function(pageName, done) {
        var self = this;
        if(pageName == 'film-home'){
            browser.sleep(6000);
        }

        self.waitForUrlChange(pageName).then(
            function(){
                expect(self.urlContains(pageName)).to.eventually.be.true.and.notify(done);
            }
        );
    });

    //Click on text block
    this.When(/^I click on "([^"]*)"$/, function(text, done){
        element(by.xpath('.//*[normalize-space(text())="' + text + '"]')).click().then(
            function(){
                done();
            }
        );
    });

    this.When(/^I click "([^"]*)" on Admin menu$/, function(menuItem, done) {
        header.clickAdminMenu(menuItem).then(done);
    });

    //For select option by label in dropdown
    this.When(/^I pick option "([^"]*)" from dropdown "([^"]*)"$/, function (option, name, done) {
        element(by.model(name)).$('[label="'+option+'"]').click().then(done);
    });

    //For selecting option by value in dropdown
    this.When(/^I pick option value "([^"]*)" from dropdown "([^"]*)"$/, function (option, name, done) {
        element(by.model(name)).$('[value="'+option+'"]').click().then(done);
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

        self.waitForClickable(dropdownMenu).then(
            function(){
                selectRole.isDisplayed().then(function(isVisible){
                    if(isVisible){
                        selectRole.click().then(done);
                    }else{
                        dropdownMenu.click().then(done);
                    }
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
                searchButton.click().then(
                    function(){
                        goToAs.click().then(done);
                    }
                )
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

    this.Then(/^I should see "([^"]*)" page in new tab$/, function (pageName, done) {
        var self = this;
        browser.getAllWindowHandles().then(function (handles) {
            browser.driver.switchTo().window(handles[1]);
            browser.ignoreSynchronization = true;
            expect(self.urlContains(pageName)).to.eventually.be.true.and.notify(function(){
                browser.driver.close();
                browser.ignoreSynchronization = false;
                browser.driver.switchTo().window(handles[0]).then(done);
            })

        });
    });

    this.When(/^I pause$/, function(done) {
        browser.pause();
        // browser.debugger();
    });

    this.When(/^I save$/, function(done) {
        var self = this;
        var saveButton = element(by.buttonText('Save'));

        self.waitForClickable(saveButton).then(done);
    });

    this.When(/^I wait for "([^"]*)" seconds$/, function(seconds, done){
        browser.sleep(seconds * 1000).then(done);
    });

    this.When(/^I refresh the page$/, function(done) {
        var self = this;
        var logo =$('.logo-container');

        self.waitForVisible(logo).then(
            function(){
                browser.driver.navigate().refresh().then(
                    function(){
                        browser.getAllWindowHandles().then(function (handles) {
                            browser.ignoreSynchronization = true;
                            browser.driver.switchTo().window(handles[0]);
                            done();
                        })
                    }
                );
            }
        )
    });

    this.When(/^I click button "([^"]*)"$/, function(buttonText, done){
        var self = this;
        var button = element(by.buttonText('buttonText'));

        self.waitForClickable(button).then(done);
    });

    this.Then(/^Then I should see the text "([^"]*)"$/, function (text, done) {
        
        expect(filmHome.shareFilmOptions.isPresent()).to.eventually.be.true.and.notify(done);
    });
    
};
