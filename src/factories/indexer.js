const pkg = require('../../package.json');

const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);
const description = 'indexer';
const model = 'IndexerResource';
const storage = 'IndexerStorage';

IntelligenceWebClient.factory('IndexerFactory', [
    '$injector',
    'BaseFactory',
    function(
        $injector,
        BaseFactory
    ) {

        const RESOURCE = $injector.get(model);

        const IndexerFactory = {

            description,
            model,
            storage,

            getIndexerGroups() {
                return RESOURCE.getIndexerGroups().$promise;
            },

            getIndexerGroupAllocationTypes() {
                return RESOURCE.getIndexerGroupAllocationTypes().$promise;
            },

            getIndexerGroupsAllocationPermissions(sportId) {
                return RESOURCE.getIndexerGroupsAllocationPermissions({sportId}).$promise;
            },

            updateIndexerGroupsAllocationPermissions(updatedPermissions) {
                return RESOURCE.updateIndexerGroupsAllocationPermissions(updatedPermissions).$promise;
            },

            getWeeklyIndexingProjections(filter) {
                return RESOURCE.getWeeklyIndexingProjections(filter).$promise;
            },

            getIndexingWeeklySettings(filter) {
                return RESOURCE.getIndexingWeeklySettings(filter).$promise;
            },

            updateWeeklyIndexingProjections(filter, updatedProjections){
                return RESOURCE.updateWeeklyIndexingProjections(filter, updatedProjections).$promise;
            },

            extendWeeklySettings(filter){
                let self = this;
                let indexers = [];
                let formattedSettings = [];

                return self.getIndexerGroups()
                    .then(function(indexerGroups){
                        indexerGroups.data.forEach(function(indexerGroup){
                            indexers.push(indexerGroup.attributes.name);
                        });
                        return self.getIndexingWeeklySettings(filter);
                    })
                    .then(function(weeklySettings){
                        weeklySettings.data.forEach(function(setting){
                            setting.attributes.indexerGroup = indexers[setting.attributes.indexerGroupId-1];
                        });
                        for(let i=0; i< 14; i++){ //14 days for two weeks
                            let item = {};
                            item.date = weeklySettings.data[i*indexers.length].attributes.date;
                            item.setting = weeklySettings.data.slice(i*indexers.length,(i+1)*indexers.length);
                            formattedSettings.push(item);
                        }
                        return formattedSettings;
                    });
            },

            updateIndexingWeeklySettings(filter, updatedSettings){
                let weeklySettings = [];
                angular.forEach(updatedSettings, function(updatedSetting){
                    weeklySettings.push(...updatedSetting.setting);
                });
                return RESOURCE.updateIndexingWeeklySettings(filter, {'data': weeklySettings}).$promise;
            },

            createDistriubtionBatchReservation() {
                return RESOURCE.createDistriubtionBatchReservation().$promise;
            },

            runIndexerGroupDistribution(id) {
                return RESOURCE.runIndexerGroupDistribution({id}).$promise;
            },

            getDistributionBatchHistory(id) {
                return RESOURCE.getDistributionBatchHistory({id}).$promise;
            },

            getDistributionLog(date){
                return RESOURCE.getDistributionLog({date}).$promise;
            },
            extendDistributionLog(filter){
                let self = this;
                let logs = {};
                let date = filter.date;

                return self.getIndexerGroups()
                    .then(function(indexerGroup){
                        indexerGroup.data.forEach(function(indexerGroup){
                            logs[indexerGroup.id] = {};
                            logs[indexerGroup.id].label = indexerGroup.attributes.name;
                        });

                        return self.getDistributionLog(date);
                    })
                    .then(function(DistributionLogs){
                        let data = DistributionLogs.data.attributes;
                        let total = 0;
                        for(var key in data){
                            let sport = key.toString();
                            for(var indexer in data[sport]){
                                if(logs[indexer]){
                                    logs[indexer][sport] = {};
                                    logs[indexer][sport]['today+distribute'] = DistributionLogs.data.attributes[sport][indexer]['today+distribute'];
                                    logs[indexer][sport]['this+reserve'] = DistributionLogs.data.attributes[sport][indexer]['this+reserve'];
                                    total += DistributionLogs.data.attributes[sport][indexer]['today+distribute'] || 0;
                                }
                            }
                        }
                        DistributionLogs.data.logs = logs;
                        DistributionLogs.data.total = total;
                        return DistributionLogs;
                    });
            }
        };

        angular.augment(IndexerFactory, BaseFactory);

        return IndexerFactory;
    }
]);
