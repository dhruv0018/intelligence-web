export default `

    <div class="allocation-settings">
        <div class="sport-select-container">
            <h4>Sport</h4>
            <select
                class="form-control"
                ng-model="selectedSportId"
                ng-options="sport.id as sport.name for sport in sports"
                ng-change="onChangeSelectedSportId()">
            </select>
        </div>

        <div class="allocation-nav state-tabs">
            <div class="allocation-nav-btn state-tab" ui-sref-active="active-state"><a ui-sref="GeneralAllocationSettings">General Settings</a></div>
            <div class="allocation-nav-btn state-tab" ui-sref-active="active-state"><a ui-sref="WeeklyAllocationSettings">Weekly Settings</a></div>
        </div>
        <main class="content" ui-view="content"></main>
    </div>
`;
