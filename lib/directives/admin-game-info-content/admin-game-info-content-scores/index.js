/* Fetch angular from the browser scope */
const angular = window.angular;
const AdminGameInfoContentScores = angular.module('AdminGameInfoContentScores', []);
import directive from './directive';
AdminGameInfoContentScores.directive('adminGameInfoContentScores', directive);

export default AdminGameInfoContentScores;
