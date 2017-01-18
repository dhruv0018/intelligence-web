const angular = window.angular;

const GameStatsPrintHeader = angular.module('GameStatsPrintHeader', []);
const templateUrl = 'lib/directives/game-stats-print-header/template.html';

GameStatsPrintHeader.component('gameStatsPrintHeader', {
    bindings: {
        game: '<'
    },
    templateUrl
});

export default GameStatsPrintHeader;
