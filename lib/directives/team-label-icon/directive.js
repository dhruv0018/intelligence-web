import link from './link';

var templateUrl = 'lib/directives/team-label-icon/template.html';

const dependencies = [
];

const KrossoverTeamLabelIconDirective = () => {

    return {

        templateUrl,
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
