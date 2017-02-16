/* Fetch angular from the browser scope */
const angular = window.angular;
import AdminGameInfoContentScores from './admin-game-info-content-scores';
const AdminGameInfoContent = angular.module('AdminGameInfoContent', [
    'AdminGameInfoContentScores'
]);
import directive from './directive';
AdminGameInfoContent.directive('adminGameInfoContent', directive);

export default AdminGameInfoContent;
