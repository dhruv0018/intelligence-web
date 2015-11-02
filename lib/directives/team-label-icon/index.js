import directive from './directive';

const angular = window.angular;
const dependencies = [
    'ngMaterial'
];

const KrossoverTeamLabelIcon = angular.module(
    'KrossoverTeamLabelIcon',
    dependencies
);

KrossoverTeamLabelIcon.directive(
    'krossoverTeamLabelIcon',
    directive
);

export default KrossoverTeamLabelIcon;
