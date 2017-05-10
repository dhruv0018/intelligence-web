var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('../view');
var path = require('path');

module.exports = function Reel(){
    var btnAddReel = $('.add-reels-dropdown');
    this.editPlays =$('#reels-edit-clips-cta');


}
