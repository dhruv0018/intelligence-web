import AllocationSettings from './allocation-settings';
import Conferences from './conferences';
import DistributionLog from './distribution-log';
import Platform from './platform';
import Queue from './queue';
import Schools from './schools';
import Teams from './teams';
import Users from './users';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Admin module.
 * @module Admin
 */
const Admin = angular.module('Admin', [
    'Users',
    'teams',
    'schools',
    'queue',
    'platform',
    'Conferences',
    'AllocationSettings',
    'DistributionLog'
]);

/**
 * Admin state router.
 * @module Admin
 * @type {UI-Router}
 */
Admin.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const admin = {
            name: 'admin',
            url: '/admin',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(admin);
    }
]);

export default Admin;
