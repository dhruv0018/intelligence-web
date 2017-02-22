var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Games(){
    var opposingTeamField = element(by.model("gameTeams.opposingTeam.name"));
    var nextBtn = element.all(by.css(".btn-submit-continue")).last();
    var roster = element.all(by.css('.tab-pane.active .roster-manager .krossover-athlete'));
    var breakdownBtn = element(by.id("non-regular-breakdown-cta"));
    var submitBtn = element.all(by.css(".btn-submit-continue")).first();
    var filmSettingsBtn = element(by.id("coach-game-instructions-cta"));
    var btnCancel = element(by.id('cancel-uploading-cta'));
    var canonicalTeamField = element(by.model("team"));
    var canonicalTeam = element(by.xpath('//span[@ng-if="match.model.name"]'));
    var scoutingCanonicalTeamField = element.all(by.model("team"));
    
    this.canonicalTeamField = element(by.model("team"));
    this.canonicalTeam = element(by.xpath('//span[@ng-if="match.model.name"]'));
    this.addNewTeam = element(by.css('div.sticky-bottom'));
    this.homeGame =$('#select-home-cta');
    this.gameInfoTab =$('#coach-game-basic-info-cta');
    this.deleteGameLink =$('#delete-game-cta');
    this.btnConfirm = element(by.partialButtonText('Yes, I understand'));
    this.checkBox = element.all(by.css('i.check-box.icon.icon-check-empty')).get(1);
    this.btnAddToReel = element(by.buttonText('Add to Reel'));
    this.createNewReel = element(by.xpath('//a[@ng-click="startCreatingNewReel()"]'));
    this.newReelName = element(by.model('newReelName'));
    this.createReelAddClip = element(by.xpath('//a[@ng-click="createReel(newReelName)"]'));
    this.deleteReelLink =$('#reels-delete-cta');
    this.btnDeleteReelConfirm = element.all(by.xpath('//button[@ng-click="ok(true)"]')).first();
    this.filmSettingsBtn = filmSettingsBtn;
    this.roster = roster;
    this.homeTeamTab =$('#coach-game-team-cta');
    this.opposingTeamTab =$('#coach-game-opposing-info-cta');
    this.btnAddNewPlayer =$$('#game-roster-add-new-player-cta').first();
    this.jerseyNumber =$$('#-jersey-cta').first();
    this.firstName =$('#-first-name-cta');
    this.lastName =$('#-last-name-cta');
    this.canonicalTeamName =$('.enteredName');

    this.enterOpposingTeam = function(opposingTeam){
        opposingTeamField.sendKeys(opposingTeam);
    }

    this.enterCanonicalTeam = function(homeCanonicalTeam){
        return canonicalTeamField.sendKeys(homeCanonicalTeam).then(()=>{
            browser.sleep(2000).then(()=>{
                return canonicalTeam.click();
            })
        })
    }

    this.enterCanonicalScoutingTeams = function(homeCanonicalScoutingTeam, opposingCanonicalScoutingTeam){
        return scoutingCanonicalTeamField.first().sendKeys(homeCanonicalScoutingTeam).then(()=>{
            browser.sleep(2000).then(()=>{
                return canonicalTeam.click().then(()=>{
                    return scoutingCanonicalTeamField.last().sendKeys(opposingCanonicalScoutingTeam).then(()=>{
                        browser.sleep(2000).then(()=>{
                            return canonicalTeam.click();
                        })
                    })
                })
            })
        })
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

    this.rosterCount = function(){
        return roster.count();
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
