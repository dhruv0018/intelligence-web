import YardFieldDefinition from './directive';

const Yard = angular.module('Field.Yard', []);

Yard.directive('yardField', () => new YardFieldDefinition());

export default Yard;
