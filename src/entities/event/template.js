/**
 * Function to compile and return a string HTML for a single event in the playlist
 *
 * @function
 * @param event {Event} - The event instance
 * @param scriptHtmlString {String} - HTML of the events from relevant script
 * @returns {String} - HTML string
 */

export default (event, scriptHtmlString, isIndexer = false) => {
    return `
    <div ng-if="${isIndexer}" class="event-time">{{event.time | time: true}}</div>
    <button
        class="item btn-select-event"
        krossover-event-highlighting
        ng-click="selectEvent();"
        ng-class="{'indexer': ${isIndexer}}"
    >

        ${scriptHtmlString}

    </button>
    `;
};
