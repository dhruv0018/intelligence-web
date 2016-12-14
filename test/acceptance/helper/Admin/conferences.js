var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Conferences(){
    var btnSearch = element(by.id('search-conference-cta'));

    this.searchConference = function(){

        return btnSearch.click();
    }


}
