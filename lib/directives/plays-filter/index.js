import directive from './directive';

const dependencies = [

];

const PlaysFilter = window.angular.module('PlaysFilter', dependencies);

PlaysFilter.directive('playsFilter', directive);

export default PlaysFilter;
