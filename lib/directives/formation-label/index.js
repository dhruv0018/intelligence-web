const angular = window.angular;

import directive from './directive';

const FormationLabel = angular.module('FormationLabel', []);

FormationLabel.directive('formationLabel', directive);

export default FormationLabel;
