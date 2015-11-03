import template from './template.html';
import link from './link';

const dependencies = [
];

const KrossoverTeamLabelIconDirective = () => {

    return {

        template,
        link,
        restrict: 'E',
        scope: {
            label: '=',
            tooltip: '=?'
        }
    };
};

KrossoverTeamLabelIconDirective.$inject = dependencies;

export default KrossoverTeamLabelIconDirective;
