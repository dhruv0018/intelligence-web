var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function AddFilm(){
    var btnAddGame = element(by.css('.add-game-btn'));
    var btnRegularGame = element(by.id('upload-regular-game-cta'));
    var btnScoutingGame = element(by.id('upload-scout-scrim-game-cta'));
    var btnUpload = element(by.id('choose-files-cta'));

    this.upload = function(){

        var fileToUpload = 'tiny_0.mp4',
        absolutePath = path.resolve(__dirname, fileToUpload);
        element.all(by.css('input[type="file"]')).get(1).sendKeys(absolutePath);
        element(by.id('start-uploading-cta')).click();
    }

    this.clickAddFilm = function(){
        browser.getCurrentUrl().then(function(url){
            if(url.indexOf('coach')>-1){
                var btnAddFilm = element(by.id("menu-coach-add-film-cta"));
            }else{
                var btnAddFilm = $('.add-game-btn');
            }
            view.scrollIntoView(btnAddFilm);
            return btnAddFilm.click();
        })
    }

}
