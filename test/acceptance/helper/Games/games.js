var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Games(){


    this.enterOpposingTeam = function(opposingTeam){
        var opposingTeamField = element(by.model("gameTeams.opposingTeam.name"));
        opposingTeamField.sendKeys(opposingTeam);
    }

    this.clickNext = function(){
        var nextBtn = element(by.css(".btn-submit-continue"));
        view.scrollIntoView(nextBtn);
        return nextBtn.click();
    }

    this.homeRosterCount = function(){
        var homeRosters = element.all(by.repeater("rosterEntry in playerRosterEntries"));
        return homeRosters.count();
        // homeRosters.count().then(function(count){
        //     console.log(count);
        // })
    }
}
