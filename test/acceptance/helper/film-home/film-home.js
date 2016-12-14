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

    this.numClipsDiv = numClipsDiv;
    this.thumbnailDiv = thumbnailDiv;
    this.wscBtn = wscBtn;

    this.clickTab = function(tabName){
        console.log(tabName);
        if(tabName === 'Reels'){
            return reelsBtn.click();
        }else{
            return gamesBtn.click();
        }
    }

    this.selectFirstGame = function(){
        return firstGame.click();
    }

    this.selectFirstReel = function(){
        return firstReel.click();
    }
}
