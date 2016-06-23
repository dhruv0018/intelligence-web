/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/game-info.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game info page module.
 * @module Info
 */
var Info = angular.module('Coach.Game.Info', [
    'ui.bootstrap',
    'colorpicker.module'
]);

/* Cache the template file */
Info.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Info directive.
 * @module Info
 * @name Info
 * @type {directive}
 */
Info.directive('krossoverCoachGameInfo', [
    function directive() {

        var krossoverCoachGameInfo = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Info.controller',

            scope: {
                headings: '=',
                tabs: '=',
                game: '=',
                league: '='
            }
        };

        return krossoverCoachGameInfo;
    }
]);

/**
 * Info controller.
 * @module Info
 * @name Info.controller
 * @type {controller}
 */
Info.controller('Coach.Game.Info.controller', [
    '$q',
    '$rootScope',
    '$scope',
    '$modal',
    '$window',
    '$state',
    '$stateParams',
    'BasicModals',
    'GAME_TYPES',
    'GAME_NOTE_TYPES',
    'SessionService',
    'TeamsFactory',
    'LeaguesFactory',
    'PlayersFactory',
    'GamesFactory',
    function controller(
        $q,
        $rootScope,
        $scope,
        $modal,
        $window,
        $state,
        $stateParams,
        modals,
        GAME_TYPES,
        GAME_NOTE_TYPES,
        session,
        teams,
        leagues,
        players,
        games
    ) {
        $scope.session = session;

        $scope.todaysDate = Date.now();

        //CONSTANTS
        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        //Factories
        $scope.games = games;

        //Collections
        $scope.teams = teams.getCollection();

        //Game Manipulation
        if($stateParams.isHomeGame) {
            $scope.game.isHomeGame = !!$stateParams.isHomeGame;
        }
        $scope.game.notes = $scope.game.notes || {};
        $scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = $scope.game.notes[GAME_NOTE_TYPES.COACH_NOTE] || [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];

        //prevents put request cascade
        $scope.game.allowEdits = ($scope.game.opposingTeamId && $scope.game.teamId && $scope.game.rosters[$scope.game.teamId] && $scope.game.rosters[$scope.game.teamId].id) ? true : false;

        if ($scope.game.id && $scope.game.teamId && $scope.game.opposingTeamId) {
            $scope.tabs.enableAll();
        }

        if ($scope.game.isRegular()) {
            $scope.game.teamId = session.currentUser.currentRole.teamId;
        }
        //Temporary code to facilitate normal input team creation
        //The true intention is to use a typeahead to pull in the teams
        //right now that is not easily possible because the typeahead cannot scope down the search results to
        //non-customer teams you have faced. Later on when this is available, this code will be modified
        $scope.gameTeams = {
            team: ($scope.teams[$scope.game.teamId]) ? $scope.teams[$scope.game.teamId] : teams.create({isCustomerTeam: false, leagueId: $scope.league.id, sportId: $scope.league.sportId, isCanonical: 0, name:''}),
            opposingTeam: ($scope.teams[$scope.game.opposingTeamId]) ? $scope.teams[$scope.game.opposingTeamId] : teams.create({isCustomerTeam: false, leagueId: $scope.league.id, sportId: $scope.league.sportId, isCanonical: 0, name:''})
        };

        $scope.gameTeams.team.displaySchool = null;
        $scope.gameTeams.opposingTeam.displaySchool = null;

        //stores the previous team name
        $scope.previousTeamName = $scope.gameTeams.team.name;
        $scope.previousOpposingTeamName = $scope.gameTeams.opposingTeam.name;

        $scope.$watch('gameTeams.opposingTeam', function(newVal, oldVal){
            if((typeof newVal === 'string'&& newVal != $scope.previousOpposingTeamName) ||
                (typeof newVal === 'object' && newVal.name != $scope.previousOpposingTeamName)){
                $scope.tabs.opposing.disabled = true;
                $scope.tabs.team.disabled = true;
                $scope.tabs.confirm.disabled = true;
            }

            if((newVal && newVal.name) || (typeof newVal === 'string' && newVal.length >= 3)){
                $scope.formGameInfo.opposingTeam.$setValidity('required', true);
            }else{
                $scope.formGameInfo.opposingTeam.$setValidity('required', false);
            }
        });

        //Save functionality
        $scope.save = function() {
            var promises = {};
            promises.team = function(){
                if (!$scope.game.teamId || $scope.gameTeams.team.name !== $scope.previousTeamName) {
                    if(typeof $scope.gameTeams.team == 'string'){
                        $scope.gameTeams.team = teams.create({
                            isCustomerTeam: false,
                            leagueId: $scope.league.id,
                            sportId: $scope.league.sportId,
                            name: $scope.gameTeams.team,
                            gender: $scope.league.gender,
                            isCanonical: 0
                        });
                        return $scope.gameTeams.team.save();
                    }else{
                        return $scope.gameTeams.team.save();
                    }
                }else{
                    return teams.get($scope.game.teamId);
                }
            }();

            promises.opposingTeam = function(){
                if (!$scope.game.opposingTeamId ||$scope.gameTeams.opposingTeam.name !== $scope.previousOpposingTeamName) {
                    if(!$scope.gameTeams.opposingTeam.id){
                        $scope.gameTeams.opposingTeam = teams.create({
                            isCustomerTeam: false,
                            leagueId: $scope.league.id,
                            sportId: $scope.league.sportId,
                            name: $scope.gameTeams.opposingTeam,
                            gender: $scope.league.gender,
                            isCanonical: 0
                        });
                    }
                    return $scope.gameTeams.opposingTeam.save();
                }else{
                    return teams.get($scope.game.opposingTeamId);
                }
            }();

            $q.all(promises).then(function(response) {
                $scope.game.teamId = (response.team) ? response.team.id : $scope.gameTeams.team.id;
                $scope.game.opposingTeamId = (response.opposingTeam) ? response.opposingTeam.id : $scope.gameTeams.opposingTeam.id;
                var team;
                try{
                    team = teams.get($scope.game.teamId);
                }catch(err){
                    team = $scope.gameTeams.team;
                }
                $scope.previousTeamName = team.name;

                var opposingTeam = {};
                var teamCopyRosterDone = false;
                var opposingCopyRosterDone = false;
                try{
                    opposingTeam = teams.get($scope.game.opposingTeamId);
                }catch(err){
                    opposingTeam = $scope.gameTeams.opposingTeam;
                }
                $scope.previousOpposingTeamName = opposingTeam.name;

                $scope.game.rosters = ($scope.game.rosters && $scope.game.rosters[$scope.game.teamId]) ? $scope.game.rosters : {};

                if (!$scope.game.rosters[$scope.game.teamId]) {
                    //filtering out the players from your team roster who are inactive
                    var filteredPlayerInfo = {};
                    $scope.$watch(function watchTeam(){
                        return Object.keys(team.roster.playerInfo).length;
                    }, function(newV, oldV){
                        if(newV === 0){
                            teams.load($scope.game.teamId).then(function(d){
                                team = d[0];
                                if(Object.keys(d[0].roster.playerInfo).length === 0){
                                    $scope.game.rosters[$scope.game.teamId] ={
                                        teamId: $scope.game.teamId,
                                        playerInfo: {}
                                    };
                                    teamCopyRosterDone = true;
                                }
                                $scope.$apply();
                            });
                        }else{
                            angular.forEach(team.roster.playerInfo, function(playerInfo, playerId) {
                                if (playerInfo.isActive) {
                                    filteredPlayerInfo[playerId] = playerInfo;
                                }
                            });

                            $scope.game.rosters[$scope.game.teamId] = {
                                teamId: $scope.game.teamId,
                                playerInfo: filteredPlayerInfo
                            };

                            teamCopyRosterDone = true;
                        }
                    });
                }else{
                    teams.load($scope.game.teamId).then(function(d){
                            teamCopyRosterDone = true;
                            $scope.$apply();
                        }
                    );
                }

                if(!$scope.game.rosters[$scope.game.opposingTeamId]){
                    $scope.$watch(function watchOpponent(){
                        return opposingTeam && opposingTeam.roster && Object.keys(opposingTeam.roster.playerInfo).length;
                    }, function(newV, oldV){
                        if(newV === 0){
                            teams.load($scope.game.opposingTeamId).then(
                                function(d){
                                    opposingTeam = d[0];
                                    if(Object.keys(d[0].roster.playerInfo).length === 0){
                                        $scope.game.rosters[$scope.game.opposingTeamId] ={
                                            teamId: $scope.game.opposingTeamId,
                                            playerInfo: {}
                                        };
                                        opposingCopyRosterDone = true;
                                    }
                                    $scope.$apply();
                                }
                            );
                        }else{
                            $scope.game.rosters[$scope.game.opposingTeamId] ={
                                teamId: $scope.game.opposingTeamId,
                                playerInfo: opposingTeam.roster.playerInfo
                            };

                            opposingCopyRosterDone = true;
                        }
                    });
                }else{
                    teams.load($scope.game.opposingTeamId).then(
                        function(d){
                            opposingCopyRosterDone = true;
                            $scope.$apply();
                        }
                    );
                }

                $scope.$watch(function checkGame(){
                    return teamCopyRosterDone && opposingCopyRosterDone;
                }, function(newV, oldV){
                    if(newV){
                        $scope.game.save().then(function() {
                            //This will be removed later when the rosters are values and do not have an id
                            //roster ids are currently used for uploading an excel roster
                            $scope.game.isFetching = true;
                            games.fetch($scope.game.id).then(function(game) {
                                delete $scope.game.isFetching;
                                delete $scope.game.isSaving;
                                angular.extend($scope.game, $scope.game, game);
                                $scope.goToRoster();
                            });
                        });
                    }else{
                        $scope.game.isSaving = true;
                    }
                });

            });

        };

        $scope.goToRoster = function() {

            $scope.tabs.enableAll();
            $scope.tabs.deactivateAll();
            $scope.formGameInfo.$dirty = false;
            $scope.tabs.team.active = true;
            $scope.game.allowEdits = true; //prevents put request cascade
        };

        //Confirmation for deleting a game
        $scope.deleteGame = function() {

            var deleteGameModal = modals.openForConfirm({
                title: 'Delete Game',
                bodyText: 'Deleting this game will delete all the information associated with it.',
                buttonText: 'Yes, I understand'
            });

            deleteGameModal.result.then(function() {
                $scope.game.isDeleted = true;

                $scope.game.save()
                .then(() => $state.go('Coach.FilmHome'));
            });

        };

        // Function from adapted Modernizr code courtesy of Chris Morgan:
        // http://stackoverflow.com/questions/7787552/check-with-javascript-for-html5-type-color-support
        $scope.checkColorInput = function() {

            var inputElem = document.createElement('input'), bool, docElement = document.documentElement, smile = ':)';

            inputElem.setAttribute('type', 'color');
            bool = inputElem.type !== 'text';

            // We first check to see if the type we give it sticks..
            // If the type does, we feed it a textual value, which shouldn't be valid.
            // If the value doesn't stick, we know there's input sanitization which infers a custom UI
            if (bool) {

                inputElem.value         = smile;
                inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                // chuck into DOM and force reflow for Opera bug in 11.00
                // github.com/Modernizr/Modernizr/issues#issue/159
                docElement.appendChild(inputElem);
                var forceReflow = docElement.offsetWidth;
                bool = inputElem.value != smile;
                docElement.removeChild(inputElem);
            }

            return bool;
        };

        $scope.supportsColorInput = $scope.checkColorInput();
    }
]);
