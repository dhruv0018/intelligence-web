/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'lib/directives/canonical-team-typeahead/template.html';

/**
 * TeamTypeahead
 * @module TeamTypeahead
 */
var CanonicalTeamTypeahead = angular.module('canonical-team-typeahead', []);

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
                notAllowed: '=',
                txtPlaceholder: '@'
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
            let oldEntry;
            element.removeClass('keyPress');

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
                var list = element[0].getElementsByTagName('li');
                var currentEl = element[0].querySelector('li.active');
                var currentIdx = Array.prototype.indexOf.call(list, currentEl);
                var minLength = 2;
                //delete or backsapce key
                if(keyEvent.keyCode === 8 || keyEvent.keyCode === 46){
                    minLength = 4;
                }
                if(name.length == minLength){
                    scope.$watch('loading', function(n, o){
                        if(n == false && o == true){
                            scope.showSticky = true;
                        }else{
                            scope.showSticky = false;
                            scope.noResults = false;
                        }
                    });
                }else if(name.length > minLength){
                    scope.showSticky = true;
                }else{
                    scope.showSticky = false;
                    scope.noResults = false;
                }
                //arrow down or up will take off hover state
                if(keyEvent.keyCode === 40 || keyEvent.keyCode === 38){
                    element.addClass('keyPress');
                }else{
                    element.removeClass('keyPress');
                }
                //press arrow down key when there's no match
                if(keyEvent.keyCode === 40 && scope.results == 1){
                    document.querySelectorAll('div.sticky-bottom a')[0].focus();
                    scope.addTeam();
                    $timeout(function(){
                        document.querySelectorAll('div.sticky-bottom a')[0].click();
                    },10);
                }
                //press arrow down key and there's more than 2 items when at 2 or more scroll
                if(keyEvent.keyCode === 40 && scope.results > 2){
                    if(currentIdx >=3){
                        element.find('li')[currentIdx].parentNode.scrollTop = element.find('li')[currentIdx].offsetTop;
                    }
                }
                //press arrow up key and there's more than 2 items when less than 2
                if(keyEvent.keyCode === 38 && scope.results > 2){
                    if(currentIdx <= 2){
                        element.find('li')[currentIdx].parentNode.scrollTop = 0;
                    }
                }
                //press enter key just take the input text as manual entry
                if(keyEvent.keyCode === 13 || keyEvent.keyCode === 9){
                    if(scope.selectedTeam && scope.selectedTeam.text){
                        scope.team = scope.selectedTeam.text;
                        scope.addTeam();
                    }
                    scope.searchFocus = false;
                }
            };
            scope.findTeams = function() {
                scope.results = null;
                scope.schools = scope.schools || {};
                oldEntry = scope.team;

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
                    if(teams.length == 1){
                        scope.noResults = true;
                    }else{
                        scope.noResults = false;
                    }
                    if (schoolIds.length > 0) {
                        return schools.load({
                            'id[]': schoolIds
                        }).then(function() {
                            angular.forEach(teams, function(team) {
                                angular.extend(team, teamObj);
                                team.displaySchool = (team.schoolId) ? schools.get(team.schoolId) : null;
                                team.displayLeague = (team.leagueId) ? leagues.get(team.leagueId) : null;
                                team.manualEntry = false;
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
                if(oldEntry){
                    scope.team = oldEntry;
                }
                scope.entered = false;
                scope.showSticky = true;
            };

            scope.addTeam = function(){
                scope.entered = true;
                scope.selectedTeam = {text: scope.team, name: scope.team, displaySchool: null, manualEntry: true};
                scope.showSticky = false;
                scope.noResults = false;
            };

            //Below are the hacks to make sticky bottom working with older version of bootstrap typeahead
            angular.element(document).bind('click', function(event){
                event.stopPropagation();
                let dropdownElm = angular.element(element[0].querySelector('.dropdown-menu'));
                let stickyElm = angular.element(element[0].querySelector('.sticky-bottom'));
                //this is when you click outside the typeahead area before you make any selection
                if((!element[0].contains(event.target) && !scope.searchFocus && !angular.element(event.target).parent().parent().hasClass('enteredWrapper')) || (angular.element(event.target).hasClass('dropdown-menu') && scope.results == 1)){
                    if(angular.isString(scope.team) && scope.team){
                        if(scope.selectedTeam){
                            scope.entered = true;
                        }else{
                            scope.team = null;
                        }
                    }
                    $timeout(function(){
                        if(dropdownElm.attr('aria-hidden') === 'true' && stickyElm.attr('aria-hidden') === 'false'){
                            scope.showSticky = false;
                            scope.noResults = false;
                        }
                    }, 0);
                }
            });

            angular.element(document).bind('mouseover', function(event){
                if(event.target.className.indexOf('sticky-bottom') > -1){
                    //take out the active state for the typeahead item
                    if(document.querySelectorAll('div.canonical-team-typeahead li.active').length>0){
                        document.querySelectorAll('div.canonical-team-typeahead li.active')[0].removeAttribute('class');
                    }
                }
                if(element[0].contains(event.target)){
                    element.removeClass('keyPress');
                }
            });

        }

        return teamTypeahead;
    }
]);

export default CanonicalTeamTypeahead;
