var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Schools(){
    var btnAddSchool = element(by.id('add-new-school-cta'));

    this.addSchool = function(){

        return btnAddSchool.click();
    }

    this.btnSaveSchool = element(by.id('save-school-cta'));


}
