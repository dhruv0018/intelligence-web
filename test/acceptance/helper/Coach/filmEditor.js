var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function FilmEditor(){
    this.filmEditorTab =$('#self-editor-cta');
    this.continueEditing = element(by.css('div.breakdown-sidebar-footer'));
    this.finishEditing = element(by.xpath('//button[contains(.,"Finish Editing")]'));
    this.createClip = element(by.css('div.tag-button-container > button.btn.btn-rounded.start-clip-button'));
    this.endClip = element(by.css('div.tag-button-container > button.btn.btn-rounded.end-clip-button'));
    this.trashIcon = element.all(by.css('i.icon.icon-trash-o')).first();
    this.clip = element.all(by.css('div.self-edited-play'));
    this.btnDelete = element.all(by.buttonText('Delete')).first();
    this.editClip = element.all(by.xpath('//span[@ng-click="onEditButtonClick()"]')).first();
    this.deleteClip = element.all(by.xpath('//span[@ng-click="showDeleteConfirmationActions = true"]'));
    this.cancelEditing =$('.cancel-editing');
    this.cancelDelete =$('.delete-cancel');
    this.btnUpdateStartTime = element(by.css('button.btn.btn-rounded.start-clip-button'));
    this.btnUpdateEndTime = element(by.css('button.btn.btn-rounded.end-clip-button'));
    this.emptyClipsState =$('.editor-empty-state');
    this.disabledPlay = element(by.css('div.playlist-item-container.play-is-newly-made.play-is-newly-made-finished.play-disabled'));

}