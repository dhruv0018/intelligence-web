import NewRoleController from './controller.js';

let definition = {
    restrict: 'E' + 'A',
    templateUrl: 'app/admin/users/new-role/template.html',
    scope:{
        user: '=',
        role: '=',
        newRoles: '='
    },
    controller: NewRoleController
};

export default ()=> definition;
