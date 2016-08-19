/* Component dependencies */
import AllocationSettingsTemplate from './template.html';
import AllocationSettingsController from './controller';
import GeneralAllocationSettingsTemplate from './general/template.html';
import GeneralAllocationSettingsController from './general/controller';
import WeeklyAllocationSettingsTemplate from './weekly/template.html';
import WeeklyAllocationSettingsController from './weekly/controller';
import AllocationSettingsDataDependencies from './data';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AllocationSettings page module.
 * @module AllocationSettings
 */
const AllocationSettings = angular.module('AllocationSettings', [
    'ui.router',
    'ui.bootstrap'
]);

AllocationSettings.factory('AllocationSettingsDataDependencies', AllocationSettingsDataDependencies);
AllocationSettings.controller('AllocationSettingsController', AllocationSettingsController);

/**
 * AllocationSettings page state router.
 * @module AllocationSettings
 * @type {UI-Router}
 */
AllocationSettings.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('AllocationSettings', {
                url: '/allocation-settings',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        template: AllocationSettingsTemplate,
                        controller: AllocationSettingsController
                    }
                },
                resolve: {
                    'AllocationSettings.Data': [
                        '$q', 'AllocationSettingsDataDependencies',
                        function($q, AllocationSettingsDataDependencies) {
                            let data = new AllocationSettingsDataDependencies();
                            return $q.all(data);
                        }
                    ]
                }
            })

            .state('GeneralAllocationSettings', {
                url: '',
                parent: 'AllocationSettings',
                views: {
                    'content@AllocationSettings': {
                        template: GeneralAllocationSettingsTemplate
                    }
                }
            })

            .state('WeeklyAllocationSettings', {
                url: '',
                parent: 'AllocationSettings',
                views: {
                    'content@AllocationSettings': {
                        template: WeeklyAllocationSettingsTemplate,
                        controller: WeeklyAllocationSettingsController
                    }
                }
            });
        }
    ]);

export default AllocationSettings;
