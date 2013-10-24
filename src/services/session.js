var IntelligenceWebClient = require('../app');

IntelligenceWebClient.service('SessionService', [
    function() {

        this.currentUser = null;

        this.currentRole = null;

    }
]);

