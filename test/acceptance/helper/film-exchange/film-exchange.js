var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function FilmExchange(){
    var btnSearch = element(by.id('search-film-cta'));
    var searchName = element(by.model('filter.teamName'));

    this.searchFilm = function(){

        return btnSearch.click();
    }


}
