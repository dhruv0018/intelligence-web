/**
 * Canonical TeamTypeahead directive Controller function
 * @module typeahead
 */
typeheadCtrl.$inject = [
    '$scope',
    '$element',
    '$attrs',
    'TeamsFactory',
    'SchoolsFactory',
    'LeaguesFactory',
    '$timeout',
    'SessionService'
];

function typeheadCtrl(
    scope,
    element,
    attr,
    teams,
    schools,
    leagues,
    $timeout,
    session
){
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
        if(scope.isFocus || typeof scope.isFocus == 'undefined'){
            $timeout(function() {
                let evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', false, true);
                (e.target).dispatchEvent(evt);
            }, 10);
        }else if(scope.selectedTeam && typeof scope.team == 'undefined'){
            scope.team = scope.selectedTeam;
            scope.searchFocus = false;
        }
    };
    scope.$watch('entered', function(value, oldValue){
        if(!value && oldValue && (scope.isFocus || typeof scope.isFocus == 'undefined')){
            $timeout(function() {
                inputEl.focus();
            }, 100);
        }
    });

    scope.keyPressTracker = function(keyEvent, name){
        var list = element[0].getElementsByTagName('li');
        var currentEl = element[0].querySelector('li.active');
        var currentIdx = Array.prototype.indexOf.call(list, currentEl);
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
            }else{
                element.find('li')[currentIdx].parentNode.scrollTop = element.find('li')[currentIdx].offsetTop-50;
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
                scope.noTeams = true;

            }else{
                scope.noResults = false;
                scope.noTeams = false;
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

    scope.addTeam = function(){
        scope.entered = true;
        scope.selectedTeam = {text: scope.team, name: scope.team, displaySchool: null, manualEntry: true};
        scope.noResults = false;
        scope.noTeams = false;
    };

    scope.changeTeam = function(){
        scope.isFocus = true;
        if(scope.notAllowed){
            return false;
        }
        if(oldEntry){
            scope.team = oldEntry;
        }
        scope.entered = false;
    };

    scope.getId = function($item) {
        scope.isFocus = false;
        scope.entered = true;
        scope.selectedTeam = $item;
    };
    //click outside the typeahead revert to original selection
    angular.element(document).bind('click', function(event){
        event.stopPropagation();
        let dropdownElm = angular.element(element[0].querySelector('.dropdown-menu'));
        //this is when you click outside the typeahead area before you make any selection
        let wrapperElm = angular.element(element[0].querySelector('.custom-popup-wrapper'));
        if((!element[0].contains(event.target) && !scope.searchFocus && !angular.element(event.target).parent().parent().hasClass('enteredWrapper')) || (angular.element(event.target).hasClass('dropdown-menu') && scope.results == 1)){
            if(angular.isString(scope.team) && scope.team){
                if(scope.selectedTeam){
                    scope.entered = true;
                    if(typeof scope.selectedTeam.save === 'function'){
                        scope.team = scope.selectedTeam;
                    }
                }else{
                    scope.team = null;
                }
            }
            $timeout(function(){
                if(angular.element(wrapperElm).attr('aria-hidden') === 'true'){
                    scope.noTeams = false;
                }
            }, 100);
        }
    });
}

export default typeheadCtrl;
