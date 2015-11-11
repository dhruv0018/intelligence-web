export default `

<div class="indexing-block" ng-class="{ 'fullscreen': fullScreenEnabled }">

    <form class="indexing-form" name="formIndexing" role="form" novalidate>

        <!-- Tags -->
        <krossover-tags
            tags="tags"
            game="game"
            ng-if="indexing.isIndexing && indexing.showTags"
        ></krossover-tags>

        <!-- Script -->
        <indexer-fields
            ng-if="indexing.isIndexing && indexing.showScript"
            event="event.current"
            on-backward="backwards"
            on-forward="forwards"
        ></indexer-fields>

        <div class="controls">

            <!-- Start button -->
            <button
                class="btn-indexing-start"
                ng-if="videoPlayer.isReady && !indexing.isIndexing"
                ng-click="indexing.index()"
            >
                <i class="icon icon-warning-sign"></i> Press <b>return</b> to index {{ videoPlayer.currentTime | time: true }}
            </button>

            <!-- State movement buttons -->
            <!-- TODO: Directivize -->
            <button
                class="btn-save"
                ng-show="indexing.isIndexing && indexing.showScript && event.current.isEnd"
                ng-click="indexing.save()"
                ng-disabled="!indexing.savable()"
                id="indexing-btn-save"
            >
                Save Event (Return)
            </button>
            <!-- TODO: Directivize -->
            <button
                class="btn-next"
                ng-show="indexing.isIndexing && indexing.showScript && !event.current.isEnd"
                ng-click="onNextClick()"
                ng-disabled="!indexing.nextable()"
                id="indexing-btn-next"
            >
                {{indexing.savable() ? 'Save Event and Continue' : 'Next'}} (Return)
            </button>

        </div>
    </form>
</div>

`;
