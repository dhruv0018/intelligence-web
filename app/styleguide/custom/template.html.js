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

            <krossover-event-adjuster video="game.video" events="events" event="events[1]"></krossover-event-adjuster>
        </div>

        <div class="video">

            <h3>Video Player With Clips Navigation</h3>

            <div class="video-container">

                <video-player></video-player>

                <clips-navigation></clips-navigation>

            </div>

        </div>

    </div>
`;
