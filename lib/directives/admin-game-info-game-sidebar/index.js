/* Fetch angular from the browser scope */
const angular = window.angular;
const AdminGameInfoGameSidebar = angular.module('AdminGameInfoGameSidebar', []);
import directive from './directive';
AdminGameInfoGameSidebar.directive('adminGameInfoGameSidebar', directive);

export default AdminGameInfoGameSidebar;
