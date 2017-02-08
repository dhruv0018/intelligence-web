var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function FilmHome(){
    var reelsBtn = element(by.css(".film-home-nav .allocation-nav-btn"));
    var gamesBtn = element(by.css(".film-home-nav .film-home-nav-btn"));
    var numClipsDiv = element(by.css('.numClips'));
    var thumbnailDiv = element(by.css('.thumbnail-container'));
    var firstGame = element(by.repeater('game in games').row(0));
    var firstReel = element(by.repeater('reel in reels').row(0));
    var wscBtn = element(by.id('wsc-highlight-cta'));
    var gameSearchBox = element(by.id('film-search-cta'));
    var reelSearchBox =$('#reel-search-cta');
    var player = $('.video-player');

    this.numClipsDiv = numClipsDiv;
    this.thumbnailDiv = thumbnailDiv;
    this.wscBtn = wscBtn;
    this.player = player;
    this.reelSearchBox = reelSearchBox;
    this.gameSearchBox = gameSearchBox;
    this.filmHomeFilter =$('#single-button');
    this.filterBreakdowns = element(by.xpath('//span[contains(text(), "Breakdowns")]'));
    this.btnApply = element(by.buttonText('Apply'));
    this.game = element.all(by.css('img.thumbnail-img')).first();
    //this.firstAwayTeam =$('div.body-row').$('div.body-cell.team');
    this.firstAwayTeam =$$('div.body-cell.team').first();
    this.gameDeletedSuccess = element(by.xpath('//span[contains(text(), "Your game has been successfully deleted")]'));
    this.firstReelName =$$('div.body-cell.name').first();
    this.activeReelsTab = element(by.css('div.allocation-nav-btn.state-tab.active-state'));

    this.clickTab = function(tabName){
        if(tabName === 'Reels'){
            return reelsBtn;
        }else{
            return gamesBtn;
        }
    }

    this.selectFirstGame = function(){
        return firstGame.click();
    }

    this.selectFirstReel = function(){
        return firstReel.click();
    }

}
