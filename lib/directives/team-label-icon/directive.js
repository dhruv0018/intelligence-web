import krossoverTeamLabelIconTemplate from './template.html';

const template = new krossoverTeamLabelIconTemplate();

const dependencies = [
];

const KrossoverTeamLabelIconDirective = () => {

    return {

        template,
        restrict: 'E',
        scope: {
            label: '='
        }
    };
};

KrossoverTeamLabelIconDirective.$inject = dependencies;

export default KrossoverTeamLabelIconDirective;
