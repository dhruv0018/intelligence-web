export default `

    <div class="custom">

        <h2>Custom Krossover Components</h2>

        <div id="arenas">

            <h3>Arenas</h3>

            <select
                ng-options="arenaId as arena.name for (arenaId, arena) in ARENA_TYPES"
                ng-model="selectedArenaId"
                ng-change="selectedArenaType = ARENA_TYPES[selectedArenaId].type"
            ></select>

            <krossover-arena
                type="selectedArenaType"
            ></krossover-arena>
        </div>
        <div>
            <h3>Indexing</h3>

            <h4>Krossover Event Adjuster</h4>

            <krossover-event-adjuster plays="plays" play="plays[1]" video="game.video" events="plays[1].events" event="plays[1].events[0]"></krossover-event-adjuster>
        </div>

    </div>
`;
