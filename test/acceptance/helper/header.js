var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var view = require('./view');

module.exports = function Header() {
    var btnAdminUsers = element(by.id('menu-admin-users-cta'));
    var btnAdminTeams = element(by.id('menu-admin-teams-cta'));
    var btnAdminSchools = element(by.id('menu-admin-schools-cta'));
    var btnAdminQueue = element(by.id('menu-admin-queue-cta'));
    var btnAdminConferences = element(by.id('menu-admin-conferences-cta'));
    var btnCoachFilmHome = element(by.id('menu-coach-new-film-home-cta'));

    this.clickCoachFilmHome = function(){
        return btnCoachFilmHome.click();
    }

    this.clickAdminMenu = function(menuItem){

        switch(menuItem){
            case "users":
                return btnAdminUsers.click();
            case "teams":
                return btnAdminTeams.click();
            case "schools":
                return btnAdminSchools.click();
            case "queue":
                return btnAdminQueue.click();
            case "conferences":
                return btnAdminConferences.click();
            default:
                break;
        }
    }

};
