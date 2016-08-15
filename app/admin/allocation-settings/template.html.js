export default `

    <div class="allocation-settings">
        <div class="sport-select-container">
            <h4>Sport</h4>
            <select class="form-control" ng-model="selectedSport" ng-options="sport as sport.name for sport in sports"></select>
        </div>

        <div class="allocation-nav">
            <div class="allocation-nav-btn" ui-sref-active="active"><a ui-sref="GeneralAllocationSettings">General Settings</a></div>
            <div class="allocation-nav-btn" ui-sref-active="active"><a ui-sref="WeeklyAllocationSettings">Weekly Settings</a></div>
        </div>
        <main class="content" ui-view="content"></main>
    </div>
`;
