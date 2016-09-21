const angular = window.angular;

import template from './template.html';
import directive from './directive';

const templateUrl = 'arena/soccer/template.html';

const SoccerArena = angular.module('Arena.Soccer', []);

SoccerArena.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

SoccerArena.directive('soccerArena', directive);

export default SoccerArena;
