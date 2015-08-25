export default `

<div class="arena-chart">

    <header>

        <div class="filters__helper">

            <count-label all-count="arenaChartController.arenaEvents.length" current-count="arenaChartController.filteredArenaEvents.length" label="Shots"></count-label>

            <div class="filter-pills">

                <pills pills="arenaChartController.activePills" pill-removed="arenaChartController.pillRemoved(pill)"></pills>

            </div>

            <button
                name="reset-filters"
                class="btn-blank btn-blank-primary layout--centered"
                tooltip="Reset Filters" tooltip-placement="bottom"
                ng-click="arenaChartController.resetFilters()"
                id="arena-chart-reset-filters-cta">

                <i class="icon icon-refresh"></i>
            </button>

        </div>

        <arena-chart-filters filter-model="arenaChartController.filters"></arena-chart-filters>

    </header>


    <main class="content-full">

        <div class="arena-chart-container">

            <krossover-arena highlight-regions="false" type="arenaChartController.arenaType" fit-element>

                <button
                    name="fullscreen"
                    class="btn btn-default layout--centered"
                    tooltip="Toggle Fullscreen" tooltip-placement="top"
                    ng-click="arenaChartController.fullscreen()">

                    <!-- TODO: Create a fullscreen button directive -->
                    <i class="icon" ng-class="{'icon-expand': !arenaChartController.fullscreenEnabled, 'icon-compress': arenaChartController.fullscreenEnabled}"></i>
                </button>

                <div class="arena-events">
                    <arena-event
                        arena-event="arenaEvent"
                        ng-click="arenaChartController.onArenaEventClick($event, arenaEvent)"
                        ng-repeat="arenaEvent in arenaChartController.filteredArenaEvents = (arenaChartController.arenaEvents | arenaEvents:arenaChartController.filters)">
                    </arena-event>
                </div>

            </krossover-arena>

        </div>

    </main>

</div>

`;
