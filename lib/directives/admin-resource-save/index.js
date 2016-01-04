/* Fetch angular from the browser scope */
const angular = window.angular;
const AdminResourceSave = angular.module('AdminResourceSave', []);
import directive from './directive';
AdminResourceSave.directive('krossoverAdminResourceSave', directive);

export default AdminResourceSave;
