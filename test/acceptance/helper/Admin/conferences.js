var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');
const moment = require('moment');

module.exports = function Conferences(){
    var btnSearch = element(by.id('search-conference-cta'));
    var btnConferences = element(by.id('menu-admin-conferences-cta'));

    this.uniqueID = moment().format().substring(0,16);
    console.log('coming from conferences helper class' + this.uniqueID);
    this.conferenceAdminSearchBox = element(by.name('conferenceCode'));
    this.conferenceAdminName = element(by.xpath('//a[@ui-sref="conference({id: conference.stringID})"]'));
    this.goToAs =$('.go-to-film-exchange');
    this.dropdown = element.all(by.css('li.header-dropdown')).last();
    this.btnNewAssociation =$('#add-new-association-cta');
    this.conferenceCode = element(by.model('association.code'));
    this.conferenceName = element(by.model('association.name'));
    this.conferenceAcronym = element(by.model('association.acronym'));
    this.btnSaveAssociation =$('#save-association-cta');
    this.newCompetitionCode = element(by.model('newCompetitionLevel.code'));
    this.newCompetitionName = element(by.model('newCompetitionLevel.name'));
    this.btnNewCompetitionLevel = element(by.xpath('//button[@ng-click="addCompetitionLevel(newCompetitionLevel)"]'));
    this.newConferenceCode = element(by.model('newConference.code'));
    this.newConferenceName = element(by.model('newConference.name'));
    this.btnNewConference = element(by.xpath('//button[@ng-click="addConference(newConference)"]'));
    this.linkAddSport =$('.add-sport-btn');
    this.btnAddSport = element(by.buttonText('Add Sport'));
    this.btnAddFilmExchange = element(by.buttonText('Add Film Exchange'));
    this.filmExchangeSuccess = element(by.repeater('filmExchange in filmExchanges'));
    this.checkboxVisibleToTeams =$('#new-film-exchange-visible-cta');
    this.filmExchangeDropdown = element(by.css('button.btn.dropdown-toggle'));
    this.conferenceGenderSport = element(by.repeater('option in matchingOptions'));
    this.filmExchangesTab = element(by.xpath('//a[@ui-sref="film-exchanges"]'));
    this.sportAddedSuccess = element(by.repeater('conferenceSport in conferenceSports'));
    this.associationSuccess = element(by.xpath('//span[contains(text(), "Changes Saved")]'));
    this.isPagerPresent = element(by.linkText('›'));
    this.conferenceSuccess = element(by.repeater('conference in conferences'));
    this.conferencesTab = element(by.xpath('//a[@ui-sref="association-conferences"]'));
    this.competitionLevelSuccess = element(by.repeater('competitionLevel in competitionLevels'));
    this.competitionLevelTab = element(by.xpath('//a[@ui-sref="competition-levels"]'));
    this.editCheckboxVisibleToTeams = element(by.xpath('//check-box[@checked="updatedFilmExchangeIsVisibleToTeams"]'));
    this.trashIcon = element.all(by.css('i.icon.icon-trash-o')).first();
    this.confirmDeletion = element.all(by.xpath('//button[@ng-click="ok(true)"]')).first();
    this.associationInformationTab = element(by.xpath('//a[@ui-sref="association-info"]'));
    var deleteAssociationLink =$('#delete-association-cta');
    this.associationDeletedSuccess = element(by.xpath('//span[contains(text(), "Association deleted successfully")]'));

    this.searchConference = function(){

        return btnSearch.click();
    }

    this.clickConferences = function(){

        return btnConferences.click();
    }

    this.clickAssociationDeleteLink = function(){
        view.scrollIntoView(deleteAssociationLink);
        return deleteAssociationLink.click();
    }

}
