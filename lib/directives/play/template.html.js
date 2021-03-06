/**
 * Function to compile and return a string HTML for a single event in the playlist
 *
 * @function
 * @param eventsHtmlString {String} - The event list items
 * @returns {String} - HTML string
 */

export default () => {

    return `
    <div
        ng-hide="!play.hasVisibleEvents && !isIndexer"
        class="play"
        ng-click="selectPlay(play)"
        ng-class="{ active: play.id == playManager.current.id, 'fully-opaque': expandAll, 'play__reel': isReelsPlay, 'edit-mode': editFlag, 'play-selected': play.isSelected }"
    >

        <play-header></play-header>

        <div
            class="playBody"
            ng-hide="editFlag || play.isSelfEdited"
            ng-if="
                isIndexer ||
                expandAll ||
                play === playManager.current ||
                showPlayBody ||
                (isReelsPlay && !editFlag && expandAll)"
            ng-class="{'playHide': (!expandAll && (play != playManager.current || isReelsPlay && editFlag )) && !showPlayBody,
                        'no-checkbox': !isTeamMember,
                        'no-play-button': isIndexer || $root.viewport.name === VIEWPORTS.MOBILE.name,
                        'indexer': isIndexer}"
        >

            <krossover-event
                class="event"
                ng-class="{'indexer': isIndexer}"
                play="play"
                event="event"
                ng-repeat="event in play.events | orderBy:'time'"
            >
            </krossover-event>

        </div>

        <play-footer ng-show="showPlayFooter()"></play-footer>

    </div>
    `;
};
