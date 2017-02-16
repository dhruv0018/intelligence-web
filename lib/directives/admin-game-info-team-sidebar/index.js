/* Fetch angular from the browser scope */
const angular = window.angular;
const AdminGameInfoTeamSidebar = angular.module('AdminGameInfoTeamSidebar', []);
import directive from './directive';
AdminGameInfoTeamSidebar.directive('adminGameInfoTeamSidebar', directive);

export default AdminGameInfoTeamSidebar;
