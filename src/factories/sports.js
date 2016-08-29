var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('SportsFactory', [
    'BaseFactory','SPORTS',
    function(BaseFactory, SPORTS) {

        var SportsFactory = {

            description: 'sports',

            model: 'SportsResource',

            storage: 'SportsStorage',

            isBrokenDownAllowed: function(){
                var self = this;
                if([ SPORTS.BASKETBALL.id, SPORTS.FOOTBALL.id, SPORTS.LACROSSE.id, SPORTS.VOLLEYBALL.id].indexOf(self.id) > -1){
                    return true;
                }else{
                    return false;
                }
            }
        };

        angular.augment(SportsFactory, BaseFactory);

        return SportsFactory;
    }
]);
