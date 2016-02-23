const angular = window.angular;

import template from './template.html';
import directive from './directive';

const FormationLabel = angular.module('FormationLabel', []);

FormationLabel.directive('formationLabel', directive);

export default FormationLabel;
