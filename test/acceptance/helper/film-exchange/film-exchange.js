var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');
const moment = require('moment');

module.exports = function FilmExchange(){

    this.dropdown = $('.header-dropdown');
    this.btnFirstShare = element.all(by.xpath('//div[@ng-click="openShareModal($event, game)"]')).first();
    this.filmExchangeOption = $('#share-film-exchange-cta');
    this.shareButtonModal = $('#share-film-exchange-done-cta');
    this.btnCloseShare = $('#share-film-dismiss-cta');
    this.teamSearchBox = element(by.name('teamName'));
    this.dateSearchBox = $('#date-played');
    this.btnSearch =$('#search-film-cta');
    this.date = moment().format('MMMM DD, YYYY');
    this.resultsDate = moment().format('MMM DD, YYYY');
    this.btnReset = element(by.xpath('//a[@ng-click="clearSearchFilter()"]'));
    this.teamName = element.all(by.css('div.flex-data')).last();
    this.btnPlay = element(by.xpath('//button[@ng-click="onClickPlayPause()"]'));
    this.btnPause = element(by.css('i.icon.icon-pause'));
    this.btnTeamAccess = element(by.xpath('//button[@ng-click="openFilmExchangeModal()"]'));
    // this.accessSwitch = element.all(by.model('team.isSuspended'));
    this.accessSwitch = element.all(by.css('.fancy-toggle input[type="checkbox"]'));
    this.modalSearchBox = $('#film-exchange-teams-search');
    this.filmExchangeMenu =$('#menu-coach-film-exchange-cta');
    this.btnClose = element(by.css('i.icon.icon-remove'));
    this.teamAccessModal = $('#film-exchange-teams');

    this.clickSearchButton = function(){
        return this.btnSearch.click();
    }

}
