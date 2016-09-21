import template from './template.html';
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'arena/soccer/template.html';
const scope = {
    region: '=ngModel'
};

const dependencies = [
    'ARENA_REGIONS'
];

/**
* SoccerArena directive.
* @module SoccerArena
* @name SoccerArena
* @type {Directive}
*/

const SoccerArenaDirective = (ARENA_REGIONS) => {

    const definition = {

        restrict: TO += ELEMENTS,

        scope,

        link,

        require: '^krossoverArena',

        templateUrl
    };

    function link(scope, element, attributes, arenaController) {

        const regionsConstant = Object.assign({}, ARENA_REGIONS.SOCCER);

        arenaController.bindClickListeners(element[0], regionsConstant, scope);
    }

    return definition;
};

SoccerArenaDirective.$inject = dependencies;

export default SoccerArenaDirective;
