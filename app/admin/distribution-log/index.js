/* Import dependencies */
import DistributionLogController from './controller';
/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Distribution Log page module.
 * @module DistributionLog
 */
var DistributionLog = angular.module('DistributionLog', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Distribution Log page state router.
 * @module DistributionLog
 * @type {UI-Router}
 */
DistributionLog.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('DistributionLog', {
                url: '/distribution-log',
                parent: 'base',
                views:{
                    'main@root':{
                        templateUrl: 'app/admin/distribution-log/template.html',
                        controller: DistributionLogController
                    }
                },
                resolve:{
                    'DistributionLog.Data':[
                        '$q', 'SportsFactory', 'IndexerFactory', function($q, SportsFactory, indexerFactory){

                            let Data = {
                                sports: SportsFactory.load(),

                                // logs: indexerFactory.getDistributionLog({date: new Date().toJSON().slice(0,10)})
                                logs: indexerFactory.extendDistributionLog({date: '2016-08-30'})
                            };

                            return $q.all(Data);
                        }
                    ]
                }
            });
    }
]);

export default DistributionLog;
