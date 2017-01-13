var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Teams(){
    var btnAddTeam = element(by.id('add-new-team-cta'));
    this.teamNameSearch =$('#search-team-name-cta');
    this.btnSearch =$('#search-teams-cta');
    this.conferencesTab =$('#team-conferences-cta');
    this.btnAddConference = element(by.css('button.btn.btn-default.btn-add-conference'));
    this.btnSaveTeamConference = element(by.buttonText('Save'));
    this.teamConferenceDropDown = element(by.css('div.search-dropdown.dropdown'));
    this.teamConferenceSearchBox = element(by.model('filters[filterCriteria]'));
    this.teamConferenceSearchResult = element.all(by.repeater('option in matchingOptions')).first();
    this.removeConferenceTeam = element.all(by.linkText('Remove')).first();

    this.addTeam = function(){

        return btnAddTeam.click();
    }


}
