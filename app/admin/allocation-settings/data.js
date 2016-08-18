/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

AllocationSettingsDataDependencies.$inject = [
    '$q',
    'SportsFactory',
    'IndexerFactory',
    'SPORTS'
];

function AllocationSettingsDataDependencies (
    $q,
    sports,
    indexerFactory,
    SPORTS
) {

    class AllocationSettingsData {

        constructor () {
            /* Load data. */
            this.sports = sports.load();
            this.indexerGroups = indexerFactory.getIndexerGroups();
            this.indexerGroupAllocationTypes = indexerFactory.getIndexerGroupAllocationTypes();

            this.indexerGroupsAllocationPermissions = indexerFactory.getIndexerGroupsAllocationPermissions(SPORTS.BASKETBALL.id);


            let today = moment.utc(new Date().toJSON().slice(0,10));
            this.weeklyIndexingProjections = indexerFactory.getWeeklyIndexingProjections({'sportId': SPORTS.BASKETBALL.id}).then(function(indexingProjections){
                angular.forEach(indexingProjections.data, function(item){
                    item.isActive = moment(item.attributes.date).isAfter(today) || moment(item.attributes.date).isSame(today);
                    item.dateString = (item.attributes.date).toString().slice(0,10);
                });
                return indexingProjections;
            });

            this.indexerGroups = indexerFactory.getIndexerGroups();
            this.weeklyIndexingSettings = indexerFactory.extendWeeklySettings({'sportId': SPORTS.BASKETBALL.id});

        }
    }

    return AllocationSettingsData;
}

export default AllocationSettingsDataDependencies;
