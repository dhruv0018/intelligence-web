var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Teams(){
    var btnAddTeam = element(by.id('add-new-team-cta'));

    this.addTeam = function(){

        return btnAddTeam.click();
    }


}
