var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Games(){
    var opposingTeamField = element(by.model("gameTeams.opposingTeam.name"));
    var nextBtn = element.all(by.css(".btn-submit-continue")).first();
    var homeRosters = element.all(by.repeater("rosterEntry in playerRosterEntries"));
    var breakdownBtn = element(by.id("non-regular-breakdown-cta"));
    var submitBtn = element.all(by.css(".btn-submit-continue")).first();
    var filmSettingsBtn = element(by.id("coach-game-instructions-cta"));
    var btnCancel = element(by.id('cancel-uploading-cta'));

    this.enterOpposingTeam = function(opposingTeam){
        opposingTeamField.sendKeys(opposingTeam);
    }

    this.clickNext = function(){
        view.scrollIntoView(nextBtn);
        return nextBtn.click();
    }

    this.clickSettings = function(){
        return filmSettingsBtn.click();
    }

    this.breakAndSubmit = function(){
        return breakdownBtn.click().then(()=>{
            return submitBtn.click();
        })
    }

    this.homeRosterCount = function(){
        return homeRosters.count();
    }

    this.clickCancel = function(){
        //for local instance the upload process may not work, if cancel button shows cancel process
        btnCancel.isDisplayed().then((isPresent)=>{
            if(isPresent){
                return btnCancel.click();
            }else{
                return true;
            }
        })
    }
}
