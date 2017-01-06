var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Conferences(){
    var btnSearch = element(by.id('search-conference-cta'));
    var btnConferences = element(by.id('menu-admin-conferences-cta'));
    
    this.searchConference = function(){

        return btnSearch.click();
    }

    this.clickConferences = function(){

        return btnConferences.click();
    }

}
