/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'canonical-team-typeahead/template.html';

/**
 * TeamTypeahead
 * @module TeamTypeahead
 */
var CanonicalTeamTypeahead = angular.module('canonical-team-typeahead', []);

/* Cache the template file */
CanonicalTeamTypeahead.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, require('./template.html'));
        $templateCache.put('canonical-team-typeahead-dropdown.html', require('./canonical-team-typeahead-dropdown.html'));
    }
]);

/**
 * triggerTypeahead directive, hack to trigger the drop down list to show
 * @module triggerTypeahead
 * @name triggerTypeahead
 * @type {Directive}
 */
CanonicalTeamTypeahead.directive('triggerTypeahead', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            element.bind('focus', function(){
                modelCtrl.$setViewValue();
            });
        }
    };
});

/**
 * TeamTypeahead directive.
 * @module TeamTypeahead
 * @name TeamTypeahead
 * @type {Directive}
 */
CanonicalTeamTypeahead.directive('canonicalTeamTypeahead', [
    'TeamsFactory', 'SchoolsFactory', 'LeaguesFactory','$timeout', 'SessionService',
    function directive(teams, schools, leagues, $timeout, session) {

        var teamTypeahead = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {

                elementId: '@',
                team: '=',
                sportId: '=?',
                teamId: '=ngModel',
                withoutRole: '=?',
                customerTeams: '=?',
                required: '=?',
                notAllowed: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link(scope, element, attr) {
            scope.results = null;
            scope.entered = scope.team.id ? true: false;
            scope.selectedTeam = scope.team.id ? scope.team : null;
            let inputEl = element[0].querySelector('.form-control');
            let teamObj = teams.create();
            scope.customTop = 41;

            if(scope.selectedTeam && scope.selectedTeam.schoolId){
                schools.load(scope.selectedTeam.schoolId).then(function(){
                    scope.selectedTeam.displaySchool = schools.get(scope.selectedTeam.schoolId);
                    scope.$apply();
                });
            }

            scope.onFocus = function (e) {
                scope.searchFocus = true;
                $timeout(function() {
                    let evt = document.createEvent('HTMLEvents');
                    evt.initEvent('change', false, true);
                    (e.target).dispatchEvent(evt);
                    if(scope.team.length > 3){
                        scope.showSticky = true;
                    }
                }, 10);
            };
            scope.$watch('entered', function(value, oldValue){
                if(!value && oldValue){
                    $timeout(function() {
                        angular.element(inputEl).focus();
                    });
                }
            });
            scope.keyPressTracker = function(keyEvent, name){
                if(name.length >3){
                    scope.showSticky = true;
                }else if(name.length < 2){
                    scope.showSticky = false;
                }else{
                    if(keyEvent.keyCode === 8 || keyEvent.keyCode === 46){ //backsapce or delete key
                        scope.showSticky = false;
                    }else{
                        scope.showSticky = true;
                    }
                }
                //press arrow down key when there's no match
                if(keyEvent.keyCode === 40 && scope.results == 1){
                    document.querySelectorAll('div.sticky-bottom a')[0].focus();
                    scope.addTeam();
                    $timeout(function(){
                        document.querySelectorAll('div.sticky-bottom a')[0].click();
                    },10);
                }

                //press enter key just take the input text as manual entry
                if(keyEvent.keyCode === 13 || keyEvent.keyCode === 9){
                    if(scope.selectedTeam && scope.selectedTeam.text){
                        scope.team = scope.selectedTeam.text;
                        scope.addTeam();
                    }
                }
            };
            scope.findTeams = function() {
                scope.results = null;
                scope.schools = scope.schools || {};

                var filter = {
                    opponentTeamName: scope.team,
                    conferenceTeamId: session.currentUser.currentRole.teamId //scope.elementId
                };

                return teams.getOpponentTeam(filter).then(function(teams) {
                    var schoolIds = [];

                    angular.forEach(teams, function(team) {
                        if (team.schoolId) {
                            schoolIds.push(team.schoolId);
                        }
                    });

                    teams.unshift({text: scope.team, name: scope.team, displaySchool: {name: scope.team}});

                    scope.results = teams.length;
                    if (schoolIds.length > 0) {
                        return schools.load({
                            'id[]': schoolIds
                        }).then(function() {
                            angular.forEach(teams, function(team) {
                                angular.extend(team, teamObj);
                                team.displaySchool = (team.schoolId) ? schools.get(team.schoolId) : null;
                                team.displayLeague = (team.leagueId) ? leagues.get(team.leagueId) : null;
                            });
                            return teams;
                        });
                    } else {
                        return teams;
                    }

                }).catch(function(){
                    return [{text: scope.team, name: scope.team, displaySchool: {name: scope.team} }];
                });
            };

            scope.getId = function($item) {
                scope.entered = true;
                scope.selectedTeam = $item;
                scope.isFocus = false;
            };

            scope.changeTeam = function(){
                if(scope.notAllowed){
                    return false;
                }
                scope.entered = false;
                scope.showSticky = true;
            };

            scope.addTeam = function(){
                scope.entered = true;
                scope.selectedTeam = {text: scope.team, name: scope.team, displaySchool: null};
                scope.showSticky = false;
            };

            //Below are the hacks to make sticky bottom working with older version of bootstrap typeahead
            angular.element(document).bind('click', function(event){
                let dropdownElm = angular.element(element[0].querySelector('.dropdown-menu'));
                let stickyElm = angular.element(element[0].querySelector('.sticky-bottom'));

                if(!element[0].contains(event.target) && !scope.searchFocus){
                    $timeout(function(){
                        if(dropdownElm.attr('aria-hidden') === 'true' && stickyElm.attr('aria-hidden') === 'false'){
                            scope.showSticky = false;
                        }
                    }, 500);
                }
            });

            angular.element(document).bind('mouseover', function(event){
                if(event.target.className.indexOf('sticky-bottom') > -1){
                    //take out the active state for the typeahead item
                    if(document.querySelectorAll('div.canonical-team-typeahead li.active').length>0){
                        document.querySelectorAll('div.canonical-team-typeahead li.active')[0].removeAttribute('class');
                    }
                }
            });

            scope.$watch('results', function(data){
                $timeout(function(){
                    if(data>1){
                        switch(data){
                            case 2:
                                scope.customTop = 90;
                                break;
                            case 3:
                                scope.customTop = 140;
                                break;
                            case 4:
                                scope.customTop = 190;
                                break;
                            default:
                                scope.customTop = 230;
                        }

                    }else{
                        scope.customTop = 41;
                    }
                }, 0);
            });


        }

        return teamTypeahead;
    }
]);
