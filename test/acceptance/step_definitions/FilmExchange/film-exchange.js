var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var FilmExchange = require("../../helper/film-exchange/film-exchange");

module.exports = function() {

	var filmExchange = new FilmExchange();

	this.When(/^I go to the "([^"]*)" film exchange$/, function(text, done) {
        var self = this;
        var dropdown =$('.header-dropdown');
        var filmExchangeName = element(by.xpath('/descendant::a[contains(text(),"' + text + '")][2]'));

        browser.actions().mouseMove(dropdown).mouseMove(filmExchangeName).click().perform().then(
        	function(){
        		done();
        	}
        );
    });

};