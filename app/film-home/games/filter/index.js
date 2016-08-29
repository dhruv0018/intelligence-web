import controller from './controller.js';

let definition = {
    restrict: 'E',
    replace: false,
    templateUrl: 'app/film-home/games/filter/template.html',
    scope:{
        filters: '=',
        gameLength: '='
    },
    controller
};

export default ()=> definition;
