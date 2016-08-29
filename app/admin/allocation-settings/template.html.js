export default `

    <div class="allocation-settings">
        <div class="sport-select-container">
            <h4>Sport</h4>
            <select
                class="form-control"
                ng-model="selectedSportId"
                ng-options="sport.id as sport.name for sport in sports"
                ng-change="onChangeSelectedSportId(selectedSportId, {{selectedSportId}})">
            </select>
        </div>
        <div class="allocation-nav state-tabs">
            <div class="allocation-nav-btn state-tab" ui-sref-active="active-state">
                <a ui-sref="GeneralAllocationSettings" ng-click="checkState($event)">
                    General Settings
                </a>
            </div>
            <div class="allocation-nav-btn state-tab" ui-sref-active="active-state">
                <a ui-sref="WeeklyAllocationSettings" ng-click="checkState($event)">
                    Weekly Settings
                </a>
            </div>
        </div>
        <main class="content" ui-view="content" ng-hide="isLoadingNewSport"></main>
        <div class="loading-content" ng-show="isLoadingNewSport">
            <krossover-spinner size="40px"></krossover-spinner>
            <p>
            Loading
            <span>
                {{$state.current.name == 'GeneralAllocationSettings' ? 'Permissions' : 'Weekly Settings'}}
            </span>
            </p>
        </div>
    </div>
`;
